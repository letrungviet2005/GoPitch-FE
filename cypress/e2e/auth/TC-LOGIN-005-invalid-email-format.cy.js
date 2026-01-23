describe("TC-LOGIN-005: Invalid email format", () => {
  it("Show email format error", () => {
    cy.visit("/signin");

    cy.get('input[type="email"]').type("abc@");
    cy.get('input[type="password"]').type("AnyPass123");
    cy.contains("button", "Đăng nhập").click();

    cy.contains("Email không đúng định dạng");
  });
});
