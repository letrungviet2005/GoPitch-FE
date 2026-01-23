describe("TC-LOGIN-003: Wrong password", () => {
  it("Show error with wrong password", () => {
    cy.visit("/signin");

    cy.get('input[type="email"]').type("valid@example.com");
    cy.get('input[type="password"]').type("WrongPass");
    cy.contains("button", "Đăng nhập").click();

    cy.contains("Email hoặc mật khẩu không đúng");
  });
});
