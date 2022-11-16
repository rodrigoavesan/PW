import React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import api from '../lib/api';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

const columns = [
    { field: 'id', headerName: 'CÓD', type:'number', width: 90 },
    {
      field: 'marca',
      headerName: ' Marca',
      width: 200,
      //Concatenando as informações de marca e modelo numa mesma coluna
      valueGetter: params => params.row?.marca + '' + params.row?.modelo
    },
    {
      field: 'ano_fabricacao',
      headerName: 'Ano Fabri.',
      type: 'number',
      width: 110,
    },
    {
      field: 'cor',
      headerName: 'Cor',
      hearderAlign: 'center',   //Alinhamento do cabeçalho
      align: 'center',          //Alinhamento da célula de dados
      width: 110,
    },
    {
      field: 'placa',
      headerName: 'Placa',
      hearderAlign: 'center',   //Alinhamento do cabeçalho
      align: 'center',          //Alinhamento da célula de dados
      width: 110,
    },
    {
      field: 'importado',
      headerName: 'Importado',
      hearderAlign: 'center',   //Alinhamento do cabeçalho
      align: 'center',          //Alinhamento da célula de dados
      width: 110,
      renderCell: params => (
        parseInt(params.row?.importado) ? <CheckBoxIcon/> : <CheckBoxOutlineBlankIcon/>
      )
    },
    {
      field: 'preco',
      headerName: 'Preço Venda',
      type: 'number',
      width: 120,
      valueGetter: params => (
        //Formatadando o preço números conforme usados no Brasil(pt-br) e em moeda real brasileiro(BRL )
       Number( params.row?.preco).toLocaleString('pt-br', {
         style: 'currency',
          currency:'BRL'})
      )
    },
    
  ];
  
  

export default function KarangoList() {


  const [state, setState] = React.useState({
    karangos:[] //Vetor Vazio
  })
  const {karangos} = state

    // useEffect() com vetor de dependências vazio para ser executado apenas uma vez no momento da montagem do componente
    React.useEffect(() => {
        //Buscar os dados da API remota
        fetchData()
    }, [])

    async function fetchData(){
        try{
            const response = await api.get('karangos')
            //Armazenar o response em um variavel de estado
            console.log({Response: response.data})
            setState({...state,karangos:response.data})
        }

        catch(error){
            alert('ERRO' + error.message)
        }
    }

    return(
        <>
            <h1>Listagem de Karangos</h1>
                <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                    rows={karangos}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[5]}
                   autoHeight
                   disableSelectionOnClick
            />
                </Box>
        </>
    )
}