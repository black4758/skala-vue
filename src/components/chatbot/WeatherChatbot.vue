<script setup>
import { ref, onMounted } from 'vue'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { fetchWeatherByCity, fetchForecastByCity } from '../../api/weatherApi'

const isOpen = ref(false)
const userInput = ref('')
const messages = ref([
  { role: 'model', text: '안녕하세요! 저는 날씨 챗봇입니다. 날씨에 대해 궁금한 점을 물어보세요! (예: 서울 날씨 어때?)' }
])
const isTyping = ref(false)

// Gemini API 초기화
let model = null
let chatHistory = []

const initChat = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) {
    console.error('VITE_GEMINI_API_KEY is missing in .env')
    return
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const today = new Date().toLocaleDateString('ko-KR')
  
  model = genAI.getGenerativeModel({
    model: 'gemini-3.5-flash-lite',
    systemInstruction: `당신은 날씨 전문 챗봇입니다. 
오늘 날짜는 ${today}입니다. 
[중요 규칙]
1. 날씨 정보를 찾기 위해 fetchWeatherByCity 함수를 호출할 때, **반드시 도시 이름을 영어로 번역(예: 서울 -> Seoul, 부산 -> Busan)**해서 전달하세요. 한글을 그대로 전달하면 API에서 인식하지 못합니다.
2. 날씨와 관련 없는 질문(예: 맛집 추천, 연예인 정보 등)은 정중하게 거부하세요. 
3. 과거 날씨에 대한 질문을 받으면 "과거 기상 데이터는 유료 서비스이므로 현재 제공할 수 없습니다."라고 안내하세요.
4. 날씨 정보를 알려줄 때는 온도, 습도, 날씨 상태 등을 자연스럽게 문장으로 풀어서 설명해주세요.
5. API 토큰(비용) 절약을 위해 불필요한 인사는 생략하고 최대한 짧고 간결하게 핵심만 답변하세요.`,
    tools: [
      {
        functionDeclarations: [
          {
            name: 'fetchWeatherByCity',
            description: '특정 도시의 현재(오늘 지금) 날씨 정보를 가져옵니다.',
            parameters: {
              type: 'OBJECT',
              properties: {
                cityName: {
                  type: 'STRING',
                  description: '날씨를 검색할 도시 이름 (예: Seoul, Busan, Jeju, Incheon 등 영어로 입력. 한국어로 질문받으면 영어로 번역해서 넘겨주세요.)',
                },
              },
              required: ['cityName'],
            },
          },
          {
            name: 'fetchForecastByCity',
            description: '특정 도시의 미래 일기 예보(내일, 모레 등) 정보를 가져옵니다.',
            parameters: {
              type: 'OBJECT',
              properties: {
                cityName: {
                  type: 'STRING',
                  description: '날씨를 검색할 도시 이름 (예: Seoul, Busan 등 반드시 영어로 번역해서 넘겨주세요.)',
                },
              },
              required: ['cityName'],
            },
          },
        ],
      },
    ],
  })
}

onMounted(() => {
  initChat()
})

const toggleChat = () => {
  isOpen.value = !isOpen.value
}

const scrollToBottom = () => {
  setTimeout(() => {
    const container = document.querySelector('.chat-messages')
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, 50)
}

const sendMessage = async () => {
  if (!userInput.value.trim() || !model) return

  const messageText = userInput.value.trim()
  userInput.value = ''
  
  // 사용자의 메시지를 UI에 추가
  messages.value.push({ role: 'user', text: messageText })
  chatHistory.push({ role: 'user', parts: [{ text: messageText }] })
  scrollToBottom()

  isTyping.value = true
  
  // 봇의 메시지를 담을 빈 객체 추가
  const botMessageIndex = messages.value.length
  messages.value.push({ role: 'model', text: '' })

  try {
    // 1. 스트리밍으로 메시지 전송
    const result = await model.generateContentStream({ contents: chatHistory })
    
    let fullResponse = ''
    let hasFunctionCall = false
    let capturedThoughtSignature = null // SDK의 응답 병합 시 누락되는 thoughtSignature를 수동 캡처

    // 2. 스트림 청크 읽기
    for await (const chunk of result.stream) {
      if (chunk.candidates && chunk.candidates[0]?.content?.parts?.[0]?.thoughtSignature) {
        capturedThoughtSignature = chunk.candidates[0].content.parts[0].thoughtSignature
      }

      const calls = typeof chunk.functionCalls === 'function' ? chunk.functionCalls() : chunk.functionCalls
      if (calls && calls.length > 0) {
        hasFunctionCall = true
      }
      
      try {
        const chunkText = chunk.text()
        if (chunkText) {
          fullResponse += chunkText
          messages.value[botMessageIndex].text = fullResponse
          scrollToBottom()
          await new Promise(r => setTimeout(r, 100)) // 스트림 청크 단위 100ms 딜레이
        }
      } catch {
        // text()가 없는 청크 무시
      }
    }

    const response = await result.response
    
    // 모델의 원본 응답(thoughtSignature 등 포함)을 히스토리에 정확히 추가
    if (response.candidates && response.candidates.length > 0) {
      const content = response.candidates[0].content
      // SDK 버그 방어 로직: 스트리밍 완료 후 병합된 객체에서 thoughtSignature가 유실되는 것 복구
      if (capturedThoughtSignature && content.parts && content.parts[0]) {
        content.parts[0].thoughtSignature = capturedThoughtSignature
      }
      chatHistory.push(content)
    }

    // 3. 함수 호출(Function Calling) 처리
    if (hasFunctionCall) {
      const call = response.functionCalls()[0]
      if (call && call.name === 'fetchWeatherByCity') {
        const cityName = call.args.cityName
        messages.value[botMessageIndex].text = `📡 ${cityName}의 현재 날씨를 조회 중입니다...`
        
        try {
          const weatherData = await fetchWeatherByCity(cityName)
          
          chatHistory.push({
            role: 'user',
            parts: [{
              functionResponse: {
                name: 'fetchWeatherByCity',
                response: {
                  temp: weatherData.main.temp,
                  humidity: weatherData.main.humidity,
                  description: weatherData.weather[0].description,
                  wind: weatherData.wind.speed
                }
              }
            }]
          })

          const functionResult = await model.generateContentStream({ contents: chatHistory })
          
          let finalResponse = ''
          for await (const chunk of functionResult.stream) {
            try {
              const chunkText = chunk.text()
              if (chunkText) {
                finalResponse += chunkText
                messages.value[botMessageIndex].text = finalResponse
                scrollToBottom()
                await new Promise(r => setTimeout(r, 15)) // 스트림 청크 단위 15ms 딜레이
              }
            } catch {
              // ignore empty chunks
            }
          }
          
          const finalResponseFull = await functionResult.response
          if (finalResponseFull.candidates && finalResponseFull.candidates.length > 0) {
            chatHistory.push(finalResponseFull.candidates[0].content)
          }

        } catch (error) {
          console.error('Weather fetch error:', error)
          messages.value[botMessageIndex].text = "날씨 정보를 가져오는 데 실패했습니다. 도시 이름을 다시 확인해주세요."
          chatHistory.pop() 
        }
      } else if (call && call.name === 'fetchForecastByCity') {
        const cityName = call.args.cityName
        messages.value[botMessageIndex].text = `📡 ${cityName}의 일기 예보를 조회 중입니다...`
        
        try {
          const forecastData = await fetchForecastByCity(cityName)
          
          // 데이터가 너무 방대하므로 하루 단위(8개 간격)로 요약하여 전달
          const simplifiedForecast = forecastData.list.filter((item, index) => index % 8 === 0).map(item => ({
            date: item.dt_txt,
            temp: item.main.temp,
            description: item.weather[0].description
          }))
          
          chatHistory.push({
            role: 'user',
            parts: [{
              functionResponse: {
                name: 'fetchForecastByCity',
                response: { forecasts: simplifiedForecast }
              }
            }]
          })

          const functionResult = await model.generateContentStream({ contents: chatHistory })
          
          let finalResponse = ''
          for await (const chunk of functionResult.stream) {
            try {
              const chunkText = chunk.text()
              if (chunkText) {
                finalResponse += chunkText
                messages.value[botMessageIndex].text = finalResponse
                scrollToBottom()
                await new Promise(r => setTimeout(r, 15)) // 스트림 청크 단위 15ms 딜레이
              }
            } catch {
              // ignore empty chunks
            }
          }
          
          const finalResponseFull = await functionResult.response
          if (finalResponseFull.candidates && finalResponseFull.candidates.length > 0) {
            chatHistory.push(finalResponseFull.candidates[0].content)
          }

        } catch (error) {
          console.error('Forecast fetch error:', error)
          messages.value[botMessageIndex].text = "예보 정보를 가져오는 데 실패했습니다. 도시 이름을 다시 확인해주세요."
          chatHistory.pop() 
        }
      }
    }
  } catch (error) {
    console.error('Chat error:', error)
    messages.value[botMessageIndex].text = "오류가 발생했습니다. 잠시 후 다시 시도해주세요."
    chatHistory.pop() // 에러 발생 시 사용자 입력 롤백
  } finally {
    isTyping.value = false
  }
}
</script>

<template>
  <div class="chatbot-container">
    <!-- 챗봇 창 -->
    <div v-if="isOpen" class="chat-window">
      <div class="chat-header">
        <h3>☁️ 날씨 요정</h3>
        <button @click="toggleChat" class="close-btn">✖</button>
      </div>
      
      <div class="chat-messages">
        <div 
          v-for="(msg, index) in messages" 
          :key="index"
          :class="['message', msg.role]"
        >
          {{ msg.text }}
        </div>
        <div v-if="isTyping" class="message model typing">
          답변을 작성하고 있습니다...
        </div>
      </div>

      <div class="chat-input-area">
        <input 
          v-model="userInput" 
          @keyup.enter="sendMessage"
          type="text" 
          placeholder="날씨를 물어보세요!" 
          :disabled="isTyping"
        />
        <button @click="sendMessage" :disabled="isTyping">전송</button>
      </div>
    </div>

    <!-- 플로팅 버튼 -->
    <button v-else @click="toggleChat" class="floating-btn">
      💬
    </button>
  </div>
</template>

<style scoped>
.chatbot-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  font-family: 'Pretendard', sans-serif;
}

.floating-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #2563eb;
  color: white;
  border: none;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
}

.floating-btn:hover {
  transform: scale(1.05);
  background: #1d4ed8;
}

.chat-window {
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  background: #2563eb;
  color: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
}

.chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f8fafc;
}

.message {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 0.95rem;
  line-height: 1.4;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.message.user {
  background: #2563eb;
  color: white;
  align-self: flex-end;
  border-bottom-right-radius: 4px;
}

.message.model {
  background: white;
  color: #0f172a;
  border: 1px solid #e2e8f0;
  align-self: flex-start;
  border-bottom-left-radius: 4px;
}

.message.typing {
  color: #64748b;
  font-style: italic;
  background: none;
  border: none;
}

.chat-input-area {
  display: flex;
  padding: 12px;
  background: white;
  border-top: 1px solid #e2e8f0;
}

.chat-input-area input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  outline: none;
  font-size: 0.95rem;
}

.chat-input-area input:focus {
  border-color: #2563eb;
}

.chat-input-area button {
  margin-left: 8px;
  padding: 0 16px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.chat-input-area button:hover {
  background: #1d4ed8;
}

.chat-input-area button:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}
</style>
