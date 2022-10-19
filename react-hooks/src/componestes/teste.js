import * as React from 'react'

function Teste(){
    /*
        Um componente React pode retornar apenas Um elemento. Caso seja necessário retornar mais de um elemento,
        pode-se agrupá-los dentro de um pseudoelemento chamado Fragment, representado por <> </>
    */
    return (
        <>
            <h1>Página Inicial do Projeto React</h1>
            <p>Este é um componente customizado criado em um Projeto React</p>
        </>
    )
}

export default Teste 