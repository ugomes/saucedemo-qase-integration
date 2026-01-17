Cypress.Commands.add('shouldShowLoginError', (expectedMessage) => {
    cy.get('[data-test="error"]')
        .should('be.visible')
        .and('have.text', expectedMessage);

    // Garante que não autenticou
    cy.url().should('eq', `${Cypress.config('baseUrl')}/`);
});
