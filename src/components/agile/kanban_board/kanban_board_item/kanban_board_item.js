import React from 'react';
import moment from 'moment';
import {tc} from 'helpers';
import Icon from 'components/icon';

export default (props) => {
    const {item, onOpen, provided, snapshot} = props;

    const _renderDealItem = () => {
        return (
            <div className={(snapshot.isDragging) ?
                'kanbanBoardItemWrapper__kanbanBoardItem__isDragging' :
                'kanbanBoardItemWrapper__kanbanBoardItem'}
                 onClick={() => {onOpen(item._id)}}
            >
                <div className='kanbanBoardItemWrapper__kanbanBoardItem__content'>
                    <div className='kanbanBoardItemWrapper__kanbanBoardItem__content__activity'>
                        <Icon val='add'/>
                    </div>
                    <div className='kanbanBoardItemWrapper__kanbanBoardItem__content__main'>
                        <div className='kanbanBoardItemWrapper__kanbanBoardItem__content__main__title'>
                            {item.name}
                        </div>
                        <div className='kanbanBoardItemWrapper__kanbanBoardItem__content__main__menu'>
                            <Icon val='dotsVert'/>
                        </div>
                    </div>
                </div>
                <div className='kanbanBoardItemWrapper__kanbanBoardItem__footer'>
                    {item.updated ?
                        <div className='kanbanBoardItemWrapper__kanbanBoardItem__footer__updated'>
                            {`${tc.lastUpdate}: ${moment(item.updated).fromNow()}`}
                        </div> : null
                    }
                </div>
            </div>
        );
    };

    const _renderProspectItem = () => {
        return (
            <div className={(snapshot.isDragging) ?
                'kanbanBoardItemWrapper__kanbanBoardItem__isDragging' :
                'kanbanBoardItemWrapper__kanbanBoardItem'}
            >
                <div className='kanbanBoardItemWrapper__kanbanBoardItem__header'>
                    {item.name}
                </div>
                <div className='kanbanBoardItemWrapper__kanbanBoardItem__content'>
                </div>
                <div className='kanbanBoardItemWrapper__kanbanBoardItem__footer'>
                </div>
            </div>
        );
    };

    return (
        <div className='kanbanBoardItemWrapper'
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
        >
            {item._id ? _renderDealItem() : _renderProspectItem()}
        </div>
    );

    // return (
    //     <Card
    //         {...rest}
    //         ref={provided.innerRef}
    //         {...provided.draggableProps}
    //         {...provided.dragHandleProps}
    //         className={clsx(
    //             classes.root,
    //             {
    //                 [classes.isDragging]: snapshot.isDragging
    //             },
    //             className
    //         )}
    //         style={{ ...style, ...provided.draggableProps.style }}
    //     >
    //         <CardHeader
    //             action={<div>Mer</div>}
    //             subheader={`#${item.ref}`}
    //             subheaderTypographyProps={{ variant: 'overline' }}
    //             title={item.title}
    //             titleTypographyProps={{ variant: 'h5', gutterBottom: true }}
    //         />
    //         <CardContent className={classes.content}>
    //             <div className={classes.stats}>
    //                 {item.files > 0 && (
    //                     <div className={classes.files}>
    //                         <AttachFileIcon />
    //                     </div>
    //                 )}
    //                 {item.comments > 0 && (
    //                     <div className={classes.comments}>
    //                         <ChatIcon />
    //                     </div>
    //                 )}
    //                 <div className={classes.flexGrow} />
    //                 <Typography
    //                     className={classes.date}
    //                     color="textSecondary"
    //                     variant="body2"
    //                 >
    //                     {moment(item.deadline).format('D MMM')}
    //                 </Typography>
    //             </div>
    //         </CardContent>
    //     </Card>
    // );
};
