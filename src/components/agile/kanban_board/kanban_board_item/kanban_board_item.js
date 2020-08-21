import React from 'react';
import clsx from 'clsx';
import moment from 'moment';
import { makeStyles } from '@material-ui/styles';
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import ChatIcon from '@material-ui/icons/Chat';

// This is so classes are created, but handle styling in /styles.
const useStyles = makeStyles(theme => ({
    root: {},
    isDragging: {},
    content: {},
    stats: {
        // display: 'flex',
        // alignItems: 'center',
        // background: 'yellow'
    },
    flexGrow: {
        // flexGrow: 1
    },
    files: {
        // color: 'red',
        // marginLeft: '20px',
        // display: 'flex',
        // alignItems: 'center'
    },
    comments: {
        // color: 'green',
        // marginLeft: '20px',
        // display: 'flex',
        // alignItems: 'center'
    },
    date: {
        // marginLeft: '20px'
    },
    progress: {
        // marginTop: '20px'
    }
}));

export default (props) => {
    const { task, onOpen, provided, snapshot, className, style, ...rest } = props;

    const classes = useStyles();

    return (
        <Card
            {...rest}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={clsx(
                classes.root,
                {
                    [classes.isDragging]: snapshot.isDragging
                },
                className
            )}
            style={{ ...style, ...provided.draggableProps.style }}
        >
            <CardHeader
                action={<div>Mer</div>}
                subheader={`#${task.ref}`}
                subheaderTypographyProps={{ variant: 'overline' }}
                title={task.title}
                titleTypographyProps={{ variant: 'h5', gutterBottom: true }}
            />
            <CardContent className={classes.content}>
                <div className={classes.stats}>
                    {task.files > 0 && (
                        <div className={classes.files}>
                            <AttachFileIcon />
                        </div>
                    )}
                    {task.comments > 0 && (
                        <div className={classes.comments}>
                            <ChatIcon />
                        </div>
                    )}
                    <div className={classes.flexGrow} />
                    <Typography
                        className={classes.date}
                        color="textSecondary"
                        variant="body2"
                    >
                        {moment(task.deadline).format('D MMM')}
                    </Typography>
                </div>
            </CardContent>
        </Card>
    );
};
