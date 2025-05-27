import { useState } from 'react'
import api from '../api/axios'
import '../components/LoginPage.css'
import { useNavigate } from 'react-router-dom'

function Admin() {
  const navigate = useNavigate();
  const [generation, setGeneration] = useState<''|number>('');
  const [num, setNum] = useState<''|number>('');
  const [password, setPassword] = useState('');

  const addUser = async () => {
    if(!generation|| !num || !password.trim()){
      alert("정보를 정확히 입력하세요.")
    }

    const check = confirm(`${generation}기 회원 ${num}명을 초기비밀번호 ${password}로 생성하시겠습니까?`);
    if (check) {
      try {
        await api.post('/user', { generation, num, password });
        alert("사용자 생성 성공")
        navigate('/admin');
      } catch {
        alert("사용자 생성 실패");
      }
    }
  };
  
  const changeAuthority = async () => {

    const check = confirm(`모든 회원의 권한을 변경하시겠습니까?`);
    if (check) {
      try {
        await api.put('/user/admin');
        alert("권한 변경 성공")
        navigate('/admin');
      } catch {
        alert("권한 변경 실패");
      }
    }
  };

  return (
    <div>
      <h2>관리자 페이지</h2>
      <h4>회원 생성하기</h4>
      <form>
        <label htmlFor="generation">기수</label>
        <input
          type="number"
          value={generation}
          id="generation"
          onChange={(e) => setGeneration(Number(e.target.value))}
        /><br/>
        <label htmlFor="num">인원</label>
        <input
          type="number"
          value={num}
          id="num"
          onChange={(e) => setNum(Number(e.target.value))}
        /><br/>
        <label htmlFor="password">초기비밀번호</label>
        <input
          type="password"
          value={password}
          id="password"
          onChange={(e) => setPassword(e.target.value)}
        /><br/>
        <input type="button" value="생성" onClick={addUser} />
      </form><hr/>
      <h4>권한 변경하기</h4>
      <button onClick={changeAuthority}>변경하기</button>
    </div>
  );
}

export default Admin;