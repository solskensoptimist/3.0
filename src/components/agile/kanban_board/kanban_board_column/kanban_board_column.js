import React from 'react';
import {tc} from 'helpers';

export default (props) => {
    const {title, total, provided, snapshot, children, ...rest} = props;

    return (
        <div className={(snapshot.isDragging) ?
                'kanbanBoardColumnWrapper isDragging' :
                'kanbanBoardColumnWrapper'}
             ref={provided.innerRef}
             {...provided.draggableProps}
             {...provided.dragHandleProps}
             {...rest}
        >
            <div className='kanbanBoardColumnWrapper__kanbanBoardColumn'>
                <div className='kanbanBoardColumnWrapper__kanbanBoardColumn__header'>
                    <div className='kanbanBoardColumnWrapper__kanbanBoardColumn__header__title'>
                        {title}
                    </div>
                    <div className='kanbanBoardColumnWrapper__kanbanBoardColumn__header__total'>
                        {total} {tc.aPiece.toLowerCase()}
                    </div>
                </div>
                <div className='kanbanBoardColumnWrapper__kanbanBoardColumn__content'>
                    {children}
                </div>
            </div>
        </div>
    );

    // return (
    //     <div
    //         {...rest}
    //         className={clsx(classes.root, className)}
    //         ref={provided.innerRef}
    //         {...provided.draggableProps}
    //         {...provided.dragHandleProps}
    //     >
    //         <div className={classes.header}>
    //             <Typography
    //                 color="inherit"
    //                 variant="h5"
    //             >
    //                 {title}
    //             </Typography>
    //             <Typography
    //                 className={classes.counter}
    //                 color="inherit"
    //                 variant="h6"
    //             >
    //                 - {total}
    //             </Typography>
    //             <div className={classes.headerAction}>
    //                 <Tooltip title="Add task">
    //                     <IconButton
    //                         color="inherit"
    //                         edge="end"
    //                         variant="contained"
    //                     >
    //                         <AddIcon />
    //                     </IconButton>
    //                 </Tooltip>
    //             </div>
    //         </div>
    //         <div
    //             className={clsx(classes.content, {
    //                 [classes.isDraggingOver]: snapshot.isDraggingOver
    //             })}
    //         >
    //             <PerfectScrollbar options={{ suppressScrollX: true }}>
    //                 <div className={classes.inner}>{children}</div>
    //             </PerfectScrollbar>
    //         </div>
    //     </div>
    // );
};
