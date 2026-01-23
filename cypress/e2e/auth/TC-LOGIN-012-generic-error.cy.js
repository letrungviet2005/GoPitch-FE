describe("TC-LOGIN-012: Generic error", () => {
  it("Do not reveal specific reason", () => {
    cy.visit("/signin");

    cy.get('input[type="email"]').type("valid@example.com");
    cy.get('input[type="password"]').type("WrongPass");
    cy.contains("button", "Đăng nhập").click();

    cy.contains("Email hoặc mật khẩu không đúng");
  });
});
