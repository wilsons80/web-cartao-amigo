interface Scripts {
    name: string;
    src: string;
}  

export const ScriptStore: Scripts[] = [
    {name: 'pagseguro-producao', src: 'https://stc.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js'},
    {name: 'pagseguro-sandbox', src: 'https://stc.sandbox.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js'}
];