export class TiposUsuariosSistema {
    tipos = [
        //{id: 1, tipo: 'ASSOCIADO_TITULAR', descricao: 'Titular'},
        //{id: 2, tipo: 'ASSOCIADO_DEPENDENTE', descricao: 'Dependente'},
        {id: 3, tipo: 'CLINICA', descricao: 'Clinica'},
        {id: 4, tipo: 'ADMINISTRATIVO', descricao: 'Administrativo'},
        {id: 5, tipo: 'ROOT', descricao: 'Root'}
    ]

    getById(id: number) {
      const tipoUsuario = this.tipos.find( d => d.id === id);
      return tipoUsuario ? tipoUsuario : null;
    }


    getByTipo(tipo: string) {
        const tipoUsuario = this.tipos.find( d => d.tipo.includes(tipo));
        return tipoUsuario ? tipoUsuario : null;
    }

    getByDescricao(descricao: string) {
      const tipoUsuario = this.tipos.find( d => d.descricao.includes(descricao));
      return tipoUsuario ? tipoUsuario.descricao : '';
    }


    isUsuarioTipoClinica(idTipoUsuario: number): boolean {
      const tipo = this.tipos.find( d => d.tipo === 'CLINICA');
      return idTipoUsuario === tipo?.id;
    }

    isUsuarioTipoAdministrativo(idTipoUsuario: number): boolean {
      const tipo = this.tipos.find( d => d.tipo === 'ADMINISTRATIVO');
      return idTipoUsuario === tipo?.id;
    }

    isUsuarioTipoRoot(idTipoUsuario: number): boolean {
      const tipo = this.tipos.find( d => d.tipo === 'ROOT');
      return idTipoUsuario === tipo?.id;
    }

}
