import React from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import { Typography, IconButton, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles(theme => ({
    root: {
        userSelect: 'none',
        whiteSpace: 'normal',
        height: '100%',
        display: 'inline-flex',
        flexDirection: 'column',
        verticalAlign: 'top',
        width: 500,
        padding: '20px',
        margin: '20px',
    },
    isDraggingOver: {},
    header: {
        backgroundColor: '#e2e2e2',
        color: '#757575',
        padding: '20px',
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center'
    },
    counter: {
        marginLeft: '20px'
    },
    headerAction: {
        marginLeft: 'auto'
    },
    content: {
        flexGrow: 1,
        overflowY: 'hidden'
    },
    inner: {
        padding: '20px'
    }
}));

export default (props) => {
    const {
        title,
        total,
        provided,
        snapshot,
        className,
        children,
        ...rest
    } = props;

    const classes = useStyles();

    return (
        <div
            {...rest}
            className={clsx(classes.root, className)}
            ref={provided.innerRef}
        >
            <div className={classes.header}>
                <Typography
                    color="inherit"
                    variant="h5"
                >
                    {title}
                </Typography>
                <Typography
                    className={classes.counter}
                    color="inherit"
                    variant="h6"
                >
                    - {total}
                </Typography>
                <div className={classes.headerAction}>
                    <Tooltip title="Add task">
                        <IconButton
                            color="inherit"
                            edge="end"
                            variant="contained"
                        >
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
            <div
                className={clsx(classes.content, {
                    [classes.isDraggingOver]: snapshot.isDraggingOver
                })}
            >
                <PerfectScrollbar options={{ suppressScrollX: true }}>
                    <div className={classes.inner}>{children}</div>
                </PerfectScrollbar>
            </div>
        </div>
    );
};
