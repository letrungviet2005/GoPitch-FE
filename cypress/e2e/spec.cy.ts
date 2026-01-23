describe('GoPitch - Login Test Cases', () => {
  const LOGIN_URL = 'http://localhost:5173/signin'
  const API_LOGIN = 'http://localhost:8080/api/v1/auth/login'

  beforeEach(() => {
    cy.visit(LOGIN_URL)
  })

  /* =======================
     TC-LOGIN-001
     Đăng nhập thành công
  ======================== */
  it('TC-LOGIN-001: Login success with valid credentials', () => {
    cy.intercept('POST', API_LOGIN).as('login')

    cy.get('input[type="email"]').type('valid@example.com')
    cy.get('input[type="password"]').type('ValidPass123')
    cy.contains('button', 'Đăng nhập').click()

    cy.wait('@login').its('response.statusCode').should('eq', 200)

    // Kiểm tra đã lưu token
    cy.window().then((win) => {
      expect(win.localStorage.getItem('accessToken')).to.exist
    })
  })

  /* =======================
     TC-LOGIN-002
     Sai email, đúng mật khẩu
  ======================== */
  it('TC-LOGIN-002: Wrong email, correct password', () => {
    cy.intercept('POST', API_LOGIN).as('login')

    cy.get('input[type="email"]').type('wrong@example.com')
    cy.get('input[type="password"]').type('ValidPass123')
    cy.contains('button', 'Đăng nhập').click()

    cy.wait('@login')
    cy.contains('Email hoặc mật khẩu').should('be.visible')
    cy.url().should('include', '/signin')
  })

  /* =======================
     TC-LOGIN-003
     Đúng email, sai mật khẩu
  ======================== */
  it('TC-LOGIN-003: Correct email, wrong password', () => {
    cy.intercept('POST', API_LOGIN).as('login')

    cy.get('input[type="email"]').type('valid@example.com')
    cy.get('input[type="password"]').type('WrongPass')
    cy.contains('button', 'Đăng nhập').click()

    cy.wait('@login')
    cy.contains('Email hoặc mật khẩu').should('be.visible')
  })

  /* =======================
     TC-LOGIN-004
     Bỏ trống email & password
  ======================== */
  it('TC-LOGIN-004: Empty email and password', () => {
    cy.intercept('POST', API_LOGIN).as('login')

    cy.contains('button', 'Đăng nhập').click()

    // Form HTML required → không gọi API
    cy.get('@login.all').should('have.length', 0)
    cy.contains('Vui lòng nhập').should('be.visible')
  })

  /* =======================
     TC-LOGIN-005
     Email sai định dạng
  ======================== */
  it('TC-LOGIN-005: Invalid email format', () => {
    cy.intercept('POST', API_LOGIN).as('login')

    cy.get('input[type="email"]').type('abc@')
    cy.get('input[type="password"]').type('AnyPass123')
    cy.contains('button', 'Đăng nhập').click()

    // HTML5 validation → không gửi request
    cy.get('@login.all').should('have.length', 0)
  })

  /* =======================
     TC-LOGIN-006
     Bỏ trống mật khẩu
  ======================== */
  it('TC-LOGIN-006: Empty password', () => {
    cy.intercept('POST', API_LOGIN).as('login')

    cy.get('input[type="email"]').type('valid@example.com')
    cy.contains('button', 'Đăng nhập').click()

    cy.get('@login.all').should('have.length', 0)
  })

  /* =======================
     TC-LOGIN-007
     Remember me (LOCAL STORAGE)
     ⚠️ App bạn hiện CHƯA có checkbox → test theo thiết kế hiện tại
  ======================== */
  it('TC-LOGIN-007: Persist login via localStorage', () => {
    cy.intercept('POST', API_LOGIN).as('login')

    cy.get('input[type="email"]').type('valid@example.com')
    cy.get('input[type="password"]').type('ValidPass123')
    cy.contains('button', 'Đăng nhập').click()

    cy.wait('@login')

    cy.reload()

    cy.window().then((win) => {
      expect(win.localStorage.getItem('accessToken')).to.exist
    })
  })

  /* =======================
     TC-LOGIN-008
     Nhiều lần sai liên tiếp
     (BACKEND RULE)
  ======================== */
  it('TC-LOGIN-008: Lock after multiple failed attempts (backend)', () => {
    cy.intercept('POST', API_LOGIN).as('login')

    for (let i = 0; i < 5; i++) {
      cy.get('input[type="email"]').clear().type('valid@example.com')
      cy.get('input[type="password"]').clear().type('WrongPass')
      cy.contains('button', 'Đăng nhập').click()
      cy.wait('@login')
    }

    cy.contains('bị khóa').should('exist')
  })

  /* =======================
     TC-LOGIN-009
     Tài khoản bị disable
  ======================== */
  it('TC-LOGIN-009: Disabled account', () => {
    cy.intercept('POST', API_LOGIN).as('login')

    cy.get('input[type="email"]').type('disabled@example.com')
    cy.get('input[type="password"]').type('ValidPass123')
    cy.contains('button', 'Đăng nhập').click()

    cy.wait('@login')
    cy.contains('tài khoản').should('be.visible')
  })

  /* =======================
     TC-LOGIN-011
     XSS input
  ======================== */
  it('TC-LOGIN-011: Prevent XSS in email field', () => {
    cy.intercept('POST', API_LOGIN).as('login')

    cy.get('input[type="email"]').type('<script>alert(1)</script>')
    cy.get('input[type="password"]').type('AnyPass123')
    cy.contains('button', 'Đăng nhập').click()

    cy.contains('Email').should('exist')
    cy.get('@login.all').should('have.length', 0)
  })

  /* =======================
     TC-LOGIN-012
     Lỗi chung, không lộ thông tin
  ======================== */
  it('TC-LOGIN-012: Generic error message', () => {
    cy.intercept('POST', API_LOGIN).as('login')

    cy.get('input[type="email"]').type('valid@example.com')
    cy.get('input[type="password"]').type('WrongPass')
    cy.contains('button', 'Đăng nhập').click()

    cy.wait('@login')
    cy.contains('Email hoặc mật khẩu không đúng').should('be.visible')
  })
})
