import React from 'react'
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import api from '../lib/api'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ConfirmDialog from '../ui/ConfirmDialog'
import Notification from '../ui/Notification'

export default function ClienteList() {

  const columns = [
 
    {
      field: 'nome',
      headerName: 'Nome',
      width: 200,
    },
    {
      field: 'cpf',
      headerName: 'CPF',
      type: 'number',
      width: 300
    },
    {
      field: 'municipio',
      headerName: 'Municipio/UF', 
      align: 'center',        
      width: 300,
      valueGetter: params => params.row?.municipio + ' ' + params.row?.uf
    },
    {
      field: 'telefone',
      headerName: 'Telefone',
      align: 'center',
      type: 'number',         
      width: 200,

    },
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
     
    },
    {
      field: 'editar',
      headerName: 'Editar',
      headerAlign: 'center',
      align: 'center',
      width: 90,
      renderCell: params =>  (
        <IconButton aria-label='Editar'>
          <EditIcon />
        </IconButton>
      )
    },
    {
      field: 'excluir',
      headerName: 'Excluir',
      headerAlign: 'center',
      align: 'center',
      width: 90,
      renderCell: params =>  (
        <IconButton aria-label='Excluir' onClick={() => handleDeleteClick(params.id)}>
          <DeleteForeverIcon color="error" />
        </IconButton>
      )
    },

  ];

  const [state, setState] = React.useState({
    clientes: [],       // Vetor vazio,
    deleteId: null,     // id do registro a ser excluído
    dialogOpen: false,  // se o diálogo de confirmação está aberto ou não,
    notifSeverity: '',  // Severidade da notificação
    notifMessage: ''    // Mensagem de notificação
  })
  const { clientes, deleteId, dialogOpen, notifSeverity, notifMessage } = state

  function handleDeleteClick(id) {
    setState({
      ...state,
      deleteId: id,
      dialogOpen: true
    })  
  }

  // useEffect() com vetor de dependências vazio para ser executado
  // apenas uma vez no momento da montagem do componente
  React.useEffect(() => {
    // Buscar os dados da API remota
    fetchData()
  }, [])

  async function fetchData(newState = state) {
    try {
      const response = await api.get('clientes')
      // Armazenar o response em um variável de estado
      setState({...newState, clientes: response.data})
    }
    catch (error) {
      setState({
        ...newState,
        notifSeverity: 'error',
        notifMessage: 'ERRO: ' + error.message
      })
    }
  }

  async function handleDialogClose(answer) {
    let newState = {...state, dialogOpen: false}
    if(answer) {
      try {
        await api.delete(`clientes/${deleteId}`)
        newState = {
          ...newState,
          notifSeverity: 'success',
          notifMessage: 'Item excluído com sucesso.'
        }
        // Recarrega os dados da grid
        fetchData(newState)
      }
      catch(error) {
        setState({
          ...newState,
          notifSeverity: 'error',
          notifMessage: 'ERRO: não foi possível excluir o item.\nMotivo: ' + error.message
        })
      }
    }
    else setState(newState)
  }

  function handleNotifClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }

    setState({...state, notifMessage: ''})  // Fecha a notificação
  }

  return (
    <>
      <h1>Listagem de clientes</h1>
      
      <ConfirmDialog
        title="Confirmação necessária"
        open={dialogOpen}
        onClose={handleDialogClose}
      >
        Deseja realmente excluir este item?
      </ConfirmDialog>

      <Notification 
        severity={notifSeverity}
        message={notifMessage}
        open={notifMessage}
        duration={5000}
        onClose={handleNotifClose}
      />

      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          sx={{
            // Esconde os botões de editar excluir na visualização normal
            '& .MuiDataGrid-row button': {
              visibility: 'hidden'
            },
            // Retorna a visibilidade dos botões quando o mouse estiver
            // sobre a linha da grid
            '& .MuiDataGrid-row:hover button': {
              visibility: 'visible'
            }
          }}
          rows={clientes}
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