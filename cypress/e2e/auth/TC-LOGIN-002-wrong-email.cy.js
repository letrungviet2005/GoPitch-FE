describe("TC-LOGIN-002: Wrong email", () => {
  it("Show error with wrong email", () => {
    cy.visit("/signin");

    cy.get('input[type="email"]').type("wrong@example.com");
    cy.get('input[type="password"]').type("ValidPass123");
    cy.contains("button", "Đăng nhập").click();

    cy.contains("Email hoặc mật khẩu không đúng");
  });
});
