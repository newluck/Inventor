import React from 'react'
import {withStyles, Table, TableBody, TableCell, TableContainer,
TableHead, TablePagination, TableRow, TableSortLabel, Typography, Paper,
FormControlLabel, Switch, CircularProgress, IconButton, Fab, Modal, 
} from '@material-ui/core'
import {Delete, FilterList, Edit, Add} from '@material-ui/icons'
import PartAdd from './Forms/Add/PartAdd'
import config from '../../config'

const axios = require('axios').default;

const columns = [
    {id: 'category', label: 'Category', minWidth: 80},
    {id: 'id', label: 'ID', minWidth: 80},
    {id: 'name', label: 'Name', minWidth: 80},
    {id: 'isdiscrete', label: 'Discrete?', minWidth: 50},
    {id: 'currentStock', label: 'Current Stock', minWidth: 100},
    {id: 'description', label: 'Description', minWidth: 250},
    {id: 'image', label: 'Thumbnail', minWidth: 80},
    {id: 'modify', label: 'Modify', minWidth: 50},
    {id: 'delete', label: 'Delete', minWidth: 50},
];

const styles = theme => ({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: '75%',
        border: 'none',
    },
    partImg: {
        width: '80px',
        height: '80px',
        position: 'static',
        float: 'none',
    },
    fabBtn: {
        margin: 0,
        top: 'auto',
        right: '20px',
        bottom: '20px',
        left: 'auto',
        position: 'fixed'
    },
    modalPaper: {
        position: 'absolute',
        width: 650,
        maxHeight: '100%',
        backgroundColor: 'white',
        border: 'none',
        boxShadow: '10px 10px 5px #6a6a6a',
        padding: '20px',
    },
});

class Parts extends React.Component {
    constructor(props) {
        super(props);
        this.classes = props.classes;
        this.props = props;
        this.state = {
            page: 0,
            rowsPerPage: 10,
            loaded: false,
            data: null,
            modalOpen: false,
            modalStyle: {
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            },
        }
    }
    componentWillMount() {
        this.getDataRows();
    }
    handleChangePage = (event, newPage) => {
        this.setState({page: newPage});
    }
    handleChangeRowsPerPage = (event) => {
        this.setState({rowsPerPage: +event.target.value});
        this.setState({page: 0});
    }
    getDataRows() {
        // * get data rows here
        axios.get(`http://${config.serverIP}:${config.serverPort}/inv_sys/api/part/all`)
        .then((response) => {
            this.setState({data: response.data});
            console.log(response.data);
            this.setState({loaded: true});
        })
    }
    handleClose = () => {
        this.setState({modalOpen: false});
    }
    addItem = () => {
        this.setState({modalOpen: true});
    }
    wasCreated = () => {
        this.setState({loaded: false});
        this.getDataRows();
        this.handleClose();
    }
    render() {
        return (
            <>
            {(this.state.loaded) ? 
            <>
            <Paper className={this.classes.root}>
            <TableContainer className={this.classes.container}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                    {columns.map((column) => (
                        <TableCell key={column.id}
                        style={{minWidth: column.minWidth}}
                        align="center">
                        {column.label}
                        </TableCell>
                    ))}  
                    </TableRow>
                </TableHead>
                <TableBody>
                {this.state.data.slice(this.state.page * this.state.rowsPerPage, this.state.page
                * this.state.rowsPerPage + this.state.rowsPerPage).map((row) => {
                    return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                        <TableCell align="center">
                            {row.category}
                        </TableCell>
                        <TableCell align="center">
                            {row.id}
                        </TableCell>
                        <TableCell align="center">
                            {row.name}
                        </TableCell>
                        <TableCell align="center">
                            {(row.is_discrete) ? "Yes" : "No"}
                        </TableCell>
                        <TableCell align="center">
                            {row.quantity}
                        </TableCell>
                        <TableCell align="center">
                            {row.description}
                        </TableCell>
                        <TableCell align="center">
                            <img src={`http://${config.serverIP}${row.img_path}`}
                            className={this.classes.partImg} />
                        </TableCell>
                        <TableCell align="center">
                            <IconButton>
                                <Edit />
                            </IconButton>
                        </TableCell>
                        <TableCell align="center">
                            <IconButton>
                                <Delete />
                            </IconButton>
                        </TableCell>
                        </TableRow>
                    )
                })}
                </TableBody>
            </Table>
            </TableContainer>
            <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={this.state.data.length}
            rowsPerPage={this.state.rowsPerPage}
            page={this.state.page}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
            </Paper>
            <Fab color="primary" onClick={this.addItem} className={this.classes.fabBtn}>
                <Add />
            </Fab>
            <Modal
                open={this.state.modalOpen}
                onClose={this.handleClose}
            >
                <div style={this.state.modalStyle} className={this.classes.modalPaper}>
                    <PartAdd whenSubmitted={this.wasCreated} />
                </div>
                
            </Modal>
            </>
            :
            <CircularProgress />
            }
            </>
        )
    }
}

export default withStyles(styles)(Parts);