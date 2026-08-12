<!-- src/App.vue -->
<template>
  <div class="app-container">
    <!-- 내비게이션 바 -->
    <nav class="main-nav">
      <h1>☁️ Weather App</h1>
      <div class="links">
        <RouterLink to="/">대시보드</RouterLink>
        <RouterLink to="/about">서비스 소개</RouterLink>
        <RouterLink to="/stats">기상 통계</RouterLink>
      </div>
    </nav>

    <!-- 라우트된 컴포넌트가 렌더링되는 영역 -->
    <main class="content-area">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  font-family: 'Pretendard', sans-serif;
  background-color: #f1f5f9;
  min-height: 100vh;
}

.main-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.main-nav h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #0f172a;
}

.links {
  display: flex;
  gap: 16px;
}

.links a {
  text-decoration: none;
  color: #64748b;
  font-weight: 600;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s;
}

.links a:hover, .links a.router-link-active {
  background-color: #eff6ff;
  color: #2563eb;
}

.content-area {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
}
</style>