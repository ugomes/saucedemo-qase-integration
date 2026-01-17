describe('Auth', () => {
    const ERR_INVALID_CREDENTIALS =
        'Epic sadface: Username and password do not match any user in this service';
    const ERR_LOCKED_OUT =
        'Epic sadface: Sorry, this user has been locked out.';
    const ERR_USERNAME_REQUIRED =
        'Epic sadface: Username is required';
    const ERR_PASSWORD_REQUIRED =
        'Epic sadface: Password is required';

    it('[SAUCE-1] Login - Autenticar com credenciais válidas', () => {
        cy.login('standard_user', 'secret_sauce');
        cy.url().should('include', '/inventory.html');
    });

    it('[SAUCE-2] Login - Rejeitar senha inválida', () => {
        cy.login('standard_user', 'wrong_pass');
        cy.shouldShowLoginError(ERR_INVALID_CREDENTIALS);
    });

    it('[SAUCE-3] Login - Rejeitar usuário inexistente', () => {
        cy.login('invalid_user', 'secret_sauce');
        cy.shouldShowLoginError(ERR_INVALID_CREDENTIALS);
    });

    it('[SAUCE-4] Login - Bloquear usuário locked_out_user', () => {
        cy.login('locked_out_user', 'secret_sauce');
        cy.shouldShowLoginError(ERR_LOCKED_OUT);
    });

    it('[SAUCE-5] Login - Validar obrigatoriedade do Username (vazio)', () => {
        cy.visit('/');
        cy.get('[data-test="password"]').clear().type('secret_sauce');
        cy.get('[data-test="login-button"]').click();

        cy.shouldShowLoginError(ERR_USERNAME_REQUIRED);
    });

    it('[SAUCE-6] Login - Validar obrigatoriedade da Password (vazia)', () => {
        cy.visit('/');
        cy.get('[data-test="username"]').clear().type('standard_user');
        cy.get('[data-test="login-button"]').click();

        cy.shouldShowLoginError(ERR_PASSWORD_REQUIRED);
    });

    it('[SAUCE-7] Login - Validar obrigatoriedade de Username e Password (ambos vazios)', () => {
        cy.visit('/');
        cy.get('[data-test="login-button"]').click();

        cy.shouldShowLoginError(ERR_USERNAME_REQUIRED);

        it('[SAUCE-8] Logout - Encerrar sessão via menu', () => {
            cy.login('standard_user', 'secret_sauce');
            cy.url().should('include', '/inventory.html');

            cy.logout();

            cy.url().then((url) => {
                const parsed = new URL(url);
                expect(parsed.hostname).to.equal('www.saucedemo.com');
                expect(parsed.pathname).to.be.oneOf(['', '/']);
            });
            cy.get('[data-test="username"]').should('be.visible');
            cy.get('[data-test="login-button"]').should('be.visible');
        });

    });
    it('[SAUCE-8] Logout - Encerrar sessão via menu', () => {
        cy.login('standard_user', 'secret_sauce');
        cy.url().should('include', '/inventory.html');

        cy.logout();

        cy.url().then((url) => {
            const parsed = new URL(url);
            expect(parsed.hostname).to.equal('www.saucedemo.com');
            expect(parsed.pathname).to.be.oneOf(['', '/']);
        });
        cy.get('[data-test="username"]').should('be.visible');
        cy.get('[data-test="login-button"]').should('be.visible');
    });

    it('[SAUCE-9] Acesso - Impedir acesso direto ao inventário sem autenticação', () => {
        cy.visit('/inventory.html', { failOnStatusCode: false });

        cy.url().then((url) => {
            const parsed = new URL(url);
            expect(parsed.hostname).to.equal('www.saucedemo.com');
            expect(parsed.pathname).to.be.oneOf(['', '/']);
        });

        cy.get('[data-test="error"]')
            .should('be.visible')
            .and(
                'have.text',
                "Epic sadface: You can only access '/inventory.html' when you are logged in."
            );
    });

});
