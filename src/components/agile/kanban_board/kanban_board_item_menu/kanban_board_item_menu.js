import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Modal, Card, CardContent, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        // position: 'absolute',
        // top: '50%',
        // left: '50%',
        // transform: 'translate(-50%, -50%)',
        // outline: 'none',
        // width: 360,
        // maxWidth: '100%'
    }
}));

export default (props) => {
    const { open, onClose, task, className, ...rest } = props;

    const classes = useStyles();

    // const mode = task ? 'edit' : 'create';

    if (!open) {
        return null;
    }

    return (
        <Modal
            onClose={onClose}
            open={open}
        >
            <Card
                {...rest}
                className={clsx(classes.root, className)}
            >
                <CardContent>
                    <Typography variant="h6">{task.title}</Typography>
                    <Typography variant="body1">{task.desc}</Typography>
                </CardContent>
            </Card>
        </Modal>
    );
};
