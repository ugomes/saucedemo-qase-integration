describe('Inventory', () => {

    const clearCart = () => {
        cy.get('body').then(($body) => {
            if ($body.find('button:contains("Remove")').length > 0) {
                cy.get('button:contains("Remove")').each(($btn) => cy.wrap($btn).click());
            }
        });
    };

    const goToFirstItemDetails = () => {
        cy.get('.inventory_item_name').first().click();
    };

    const getProductNames = () =>
        cy.get('.inventory_item_name').then(($list) =>
            [...$list].map((e) => e.innerText.trim())
        );

    const getProductPrices = () =>
        cy.get('.inventory_item_price').then(($list) =>
            [...$list].map((e) => Number(e.innerText.replace('$', '')))
        );


    it('[SAUCE-10] Inventory - Exibir listagem de produtos', () => {
        cy.login('standard_user', 'secret_sauce');
        cy.url().should('include', '/inventory.html');
        cy.get('.inventory_list').should('be.visible');
        cy.get('.inventory_item').should('have.length.at.least', 1);
    });


    it('[SAUCE-11] Inventory - Validar informações do card do produto (nome, preço, imagem, botão)', () => {
        cy.login('standard_user', 'secret_sauce');
        cy.url().should('include', '/inventory.html');
        cy.get('.inventory_item').first().within(() => {
            cy.get('.inventory_item_name').should('be.visible').and('not.be.empty');
            cy.get('.inventory_item_desc').should('be.visible').and('not.be.empty');
            cy.get('.inventory_item_price').should('be.visible');

            cy.get('.inventory_item_img img')
                .should('exist')
                .and(($img) => {
                    expect($img.attr('src')).to.not.be.empty;
                });

            cy.get('button')
                .should('be.visible')
                .and(($btn) => {
                    const text = $btn.text().trim();
                    expect(['Add to cart', 'Remove']).to.include(text);
                });
        });
    });


    it('[SAUCE-12] Inventory - Abrir detalhes ao clicar no nome do produto', () => {
        cy.login('standard_user', 'secret_sauce');

        cy.get('.inventory_item_name')
            .first()
            .invoke('text')
            .then((productName) => {
                cy.get('.inventory_item_name').first().click();
                cy.get('.inventory_details_name').should('have.text', productName);
            });
    });


    it('[SAUCE-13] Inventory - Abrir detalhes ao clicar na imagem do produto', () => {
        cy.login('standard_user', 'secret_sauce');

        cy.get('.inventory_item_name')
            .first()
            .invoke('text')
            .then((productName) => {
                cy.get('.inventory_item_img').first().click();
                cy.get('.inventory_details_name').should('have.text', productName);
            });
    });


    it('[SAUCE-14] Inventory - Botão "Back to products" retorna à listagem', () => {
        cy.login('standard_user', 'secret_sauce');

        goToFirstItemDetails();
        cy.get('[data-test="back-to-products"]').click();

        cy.url().should('include', '/inventory.html');
        cy.get('.inventory_item').should('have.length.at.least', 1);
    });


    it('[SAUCE-15] Inventory - Ordenar por nome (A to Z)', () => {
        cy.login('standard_user', 'secret_sauce');
        cy.url().should('include', '/inventory.html');
        cy.get('.inventory_list', { timeout: 10000 }).should('be.visible');
        cy.get('.product_sort_container').should('be.visible').select('Name (A to Z)');
        getProductNames().then((names) => {
            const sorted = [...names].sort((a, b) => a.localeCompare(b));
            expect(names).to.deep.equal(sorted);
        });
    });


    it('[SAUCE-16] Inventory - Ordenar por nome (Z to A)', () => {
        cy.login('standard_user', 'secret_sauce');
        cy.url().should('include', '/inventory.html');
        cy.get('.inventory_list', { timeout: 10000 }).should('be.visible');
        cy.get('.product_sort_container').should('be.visible').select('Name (Z to A)');
        getProductNames().then((names) => {
            const sorted = [...names].sort((a, b) => b.localeCompare(a));
            expect(names).to.deep.equal(sorted);
        });
    });


    it('[SAUCE-17] Inventory - Ordenar por preço (low to high)', () => {
        cy.login('standard_user', 'secret_sauce');
        cy.url().should('include', '/inventory.html');
        cy.get('.inventory_list', { timeout: 10000 }).should('be.visible');
        cy.get('.product_sort_container').should('be.visible').select('Price (low to high)');
        getProductPrices().then((prices) => {
            const sorted = [...prices].sort((a, b) => a - b);
            expect(prices).to.deep.equal(sorted);
        });
    });


    it('[SAUCE-18] Inventory - Ordenar por preço (high to low)', () => {
        cy.login('standard_user', 'secret_sauce');
        cy.url().should('include', '/inventory.html');
        cy.get('.inventory_list', { timeout: 10000 }).should('be.visible');
        cy.get('.product_sort_container').should('be.visible').select('Price (high to low)');
        getProductPrices().then((prices) => {
            const sorted = [...prices].sort((a, b) => b - a);
            expect(prices).to.deep.equal(sorted);
        });
    });


    it('[SAUCE-19] Inventory - Adicionar produto ao carrinho pela listagem', () => {
        cy.login('standard_user', 'secret_sauce');
        clearCart();

        cy.get('button:contains("Add to cart")').first().click();
        cy.get('.shopping_cart_badge').should('have.text', '1');
    });


    it('[SAUCE-20] Inventory - Remover produto ao clicar em Remove pela listagem', () => {
        cy.login('standard_user', 'secret_sauce');
        clearCart();

        cy.get('button:contains("Add to cart")').first().click();
        cy.get('.shopping_cart_badge').should('have.text', '1');

        cy.get('button:contains("Remove")').first().click();
        cy.get('.shopping_cart_badge').should('not.exist');
    });

    it('[SAUCE-21] Inventory - Badge incrementa ao adicionar múltiplos produtos', () => {
        cy.login('standard_user', 'secret_sauce');
        clearCart();

        cy.get('button:contains("Add to cart")').eq(0).click();
        cy.get('.shopping_cart_badge').should('have.text', '1');

        cy.get('button:contains("Add to cart")').eq(1).click();
        cy.get('.shopping_cart_badge').should('have.text', '2');
    });


    it('[SAUCE-22] Inventory - Badge decrementa ao remover um item', () => {
        cy.login('standard_user', 'secret_sauce');
        clearCart();

        cy.get('button:contains("Add to cart")').eq(0).click();
        cy.get('button:contains("Add to cart")').eq(1).click();
        cy.get('.shopping_cart_badge').should('have.text', '2');

        cy.get('button:contains("Remove")').first().click();
        cy.get('.shopping_cart_badge').should('have.text', '1');
    });


    it('[SAUCE-23] Inventory - Estado do botão persiste após navegar para detalhes e voltar', () => {
        cy.login('standard_user', 'secret_sauce');
        clearCart();

        cy.get('button:contains("Add to cart")').first().click();
        cy.get('button:contains("Remove")').first().should('be.visible');

        goToFirstItemDetails();

        cy.get('button:contains("Remove")').should('be.visible');

        cy.get('[data-test="back-to-products"]').click();

        cy.get('button:contains("Remove")').first().should('be.visible');
    });
});
