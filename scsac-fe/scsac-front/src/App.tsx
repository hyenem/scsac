// 📁 src/App.tsx
import Header from './components/Header'
import LoginPage from './pages/LoginPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CategoryListPage from './pages/CategoryListPage'
import BoardPage from './pages/BoardPage'
import WritePage from './pages/WritePage'
import SidebarLayout from './components/SidebarLayout'
import ArticleDetailPage from './pages/ArticleDetailPage'
import Admin from './pages/Admin'
import PrivateRoute from './components/PrivateRoute'
import ArticleEditPage from './pages/ArticleEditPage'
import MyPage from './pages/MyPage'
import EditProfile from './pages/EditProfilePage'
import { useEffect } from 'react'
import api from './api/axios'
import { useDispatch } from 'react-redux'
import { login, logout } from './store/userSlice'


function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    const restoreUser = async () => {
      const token = localStorage.getItem("jwt")
      if (!token) 
        return

      try {
        const res = await api.get("/user/me")
        const user = res.data

        dispatch(login({
          id: user.id,
          password: user.password,
          authority: user.authority,
          generation: user.generation,
          affiliate: user.affiliate,
          name: user.name,
          nickname: user.nickname,
          boj_id: user.boj_id,
        }))
      }
      
      catch (err) {
        console.log("토큰이 유효하지 않음. 자동 로그아웃")
        localStorage.removeItem("jwt")
        dispatch(logout())
      }
    }

    restoreUser()
  }, [dispatch])

  return (
    <>
    <BrowserRouter>
      <Header />
      <Routes>
        {/* 누구나 접근 가능한 로그인 페이지 */}  
        {/* path에 '/'있으면 루트부터 시작하는 절대경로 */}
        <Route path="/" element={<LoginPage />} />
      
        <Route element={<SidebarLayout />}>
          <Route path="/admin" element={<PrivateRoute><Admin/></PrivateRoute>}/>
          <Route path="/category" element={<PrivateRoute><CategoryListPage /></PrivateRoute>} />
          <Route path="/category/:id" element={<PrivateRoute><BoardPage /></PrivateRoute>} />
          <Route path="/category/:id/write" element={<PrivateRoute><WritePage /></PrivateRoute>} />
          <Route path="/article/:id" element={<PrivateRoute><ArticleDetailPage /></PrivateRoute>} />
          <Route path="/article/:id/edit" element={<PrivateRoute><ArticleEditPage/></PrivateRoute>}/>
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/editProfile" element={<EditProfile />} />
        </Route>

      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
