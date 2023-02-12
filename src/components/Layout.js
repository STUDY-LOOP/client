function Layout({userNick, participatingCount, email}){
    return (
        <div className="profile-wrap">
            <div className="profile">
                { userNick !== null
                ?
                <div>
                    <div className="user-name">{`안녕하세요! ${userNick}님`}</div>
                    <div className="study-info">
                        <div>참여중인 스터디</div>
                        <div className="count participating-count">
                            {`${participatingCount}개`}
                        </div>
                    </div>
                    <input id="my-id" type="hidden" value={email} />
                    <a id="my-profile" href="/my/profile" className="btn">마이페이지</a>
                    <a id="logout" href="/auth/logout" className="btn">로그아웃</a>
                </div>

                : <form id="login-form" action="/auth/login" method="post">
                    <div className="input-group">
                        <label htmlFor="email">이메일</label>
                        <input id="email" type="email" name="email" required autoFocus />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">비밀번호</label>
                        <input id="password" type="password" name="password" required />
                    </div>
                    <a id="join" href="/join" className="btn">회원가입</a>
                    <button id="login" type="submit" className="btn">로그인</button>
                </form>
                }
                
            </div>
        </div>
    )
}

export default Layout;