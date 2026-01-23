describe("TC-LOGIN-006: Empty password", () => {
  it("Require password", () => {
    cy.visit("/signin");

    cy.get('input[type="email"]').type("valid@example.com");
    cy.contains("button", "Đăng nhập").click();

    cy.contains("Vui lòng nhập mật khẩu");
  });
});
