import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Modal, Card, CardContent, Typography } from '@material-ui/core';

// This is so classes are created, but handle styling in /styles.
const useStyles = makeStyles(theme => ({root: {}}));

export default (props) => {
    const {open, onClose, item, className, ...rest} = props;

    const classes = useStyles();

    // const mode = item ? 'edit' : 'create';

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
                    <Typography variant="h6">{item.title}</Typography>
                    <Typography variant="body1">{item.desc}</Typography>
                </CardContent>
            </Card>
        </Modal>
    );
};
