describe("TC-LOGIN-001: Login success", () => {
  it("Login with valid credentials", () => {
    cy.visit("/signin");

    cy.get('input[type="email"]').type("vietlt.23it@vku.udn.vn");
    cy.get('input[type="password"]').type("123456789");
    cy.contains("button", "Đăng nhập").click();

    cy.url().should("not.include", "/signin");
  });
});
