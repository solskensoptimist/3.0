import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {tc} from 'helpers';
import {updateDeal} from 'store/deal/tasks';
import ReactS3Uploader from 'react-s3-uploader';
import Icon from 'components/icon';
import InfoBox from 'components/info_box';
import Loading from 'components/loading';
import Tooltip from 'components/tooltip';
import WidgetHeader from 'components//widget_header';

/**
 * This component renders a list of files, based on store.deal.deal.files.
 * Also an upload button.
 */
const DealFiles = (state) => {
    const amountIncrease = 10;
    const [fileRows, setFileRows] = useState(null);
    const [dataLength, setDataLength] = useState(null); // Used to know when we have rendered all rows.
    const [showAmount, setShowAmount] = useState(amountIncrease);
    const [minimize, setMinimize] = useState(false);

    const _finishUpload = async (e, f) => {
        let files;
        if (Array.isArray(state.deal.deal.meta.files)) {
            files = state.deal.deal.meta.files.concat([{
                s3_filename: e.filename,
                original_name: f.name,
            }]);
        } else {
            files = [{
                s3_filename: e.filename,
                original_name: f.name,
            }];
        }

        return await updateDeal({files: files});
    };

    const _startUpload = () => {
        document.querySelector('#s3Uploader').click();
    };

    const _stateCheck = () => {
        return !!(state && state.deal && state.deal.deal && state.deal.deal.meta && state.deal.deal.meta.files);
    };

    const _uploadError = (message) => {
        console.error('S3 file upload error:', message);
    };

    useEffect(() => {
        const _removeFile = async (file) => {
            const files = state.deal.deal.meta.files.filter((num) => num.s3_filename !== file.s3_filename);
            return await updateDeal({files: files});
        };

        const _renderFiles = () => {
            let data = state.deal.deal.meta.files;

            // If no data, minimize widget.
            if (!data || (data && data.length === 0)) {
                setFileRows([]);
                return setMinimize(true);
            } else {
                setMinimize(false);
            }

            // Set data length before slice.
            setDataLength(data.length);

            // Show more rows every time user click load icon.
            data = data.slice(0, showAmount);

            setFileRows(data.map((num, i) => {
                return (
                    <React.Fragment key={i}>
                        {_renderFileItem(num)}
                    </React.Fragment>
                );
            }));
        };

        const _renderFileItem = (file) => {
            return(
                <div className='dealFilesWrapper__dealFiles__content__files__file' key={file.original_name}>
                    <div className='dealFilesWrapper__dealFiles__content__files__file__icon'><Icon val='file'/></div>
                    <div className='dealFilesWrapper__dealFiles__content__files__file__remove'><Tooltip horizontalDirection='left' tooltipContent={tc.remove}><Icon onClick={() => {_removeFile(file)}} val='remove'/></Tooltip></div>
                    <p>{file.original_name}</p>
                    <a href={`https://s3.eu-central-1.amazonaws.com/bilp-test/${file.s3_filename}`} target='_blank' rel='noopener noreferrer'><Tooltip horizontalDirection='left' tooltipContent={tc.download}><Icon val='download'/></Tooltip></a>
                </div>
            );
        };

        _renderFiles();
    }, [showAmount, state.deal.deal.meta.files]);

    return ( _stateCheck() ?
            <div className='dealFilesWrapper'>
                <div className='dealFilesWrapper__dealFiles'>
                    <div className='dealFilesWrapper__dealFiles__header'>
                        <WidgetHeader
                            iconVal='file'
                            dashboard={
                                minimize ?
                                    <>
                                        <Tooltip horizontalDirection='left' tooltipContent={tc.maximize}><Icon val='maximize' onClick={() => {setMinimize(false)}}/></Tooltip>
                                    </> :
                                    <>
                                        <Tooltip horizontalDirection='left' tooltipContent={tc.uploadFile}><Icon val='add' onClick={() => {_startUpload()}}/></Tooltip>
                                        {(showAmount > amountIncrease) && <Tooltip horizontalDirection='left' tooltipContent={tc.regret}><Icon val='regret' onClick={() => {setShowAmount(amountIncrease)}}/></Tooltip>}
                                        {(showAmount < dataLength) && <Tooltip horizontalDirection='left' tooltipContent={tc.load}><Icon val='load' onClick={() => {setShowAmount(showAmount + amountIncrease)}}/></Tooltip>}
                                        <Tooltip horizontalDirection='left' tooltipContent={tc.minimize}><Icon val='minimize' onClick={() => {setMinimize(true)}}/></Tooltip>
                                    </>
                            }
                            headline={tc.files}
                            headlineSub={tc.handleFiles}
                        />
                    </div>
                    {!minimize &&
                    <div className='dealFilesWrapper__dealFiles__content'>
                        {(fileRows && fileRows.length) ?
                            <div className='dealFilesWrapper__dealFiles__content__files'>
                                {fileRows}
                            </div> :
                            <InfoBox>
                                <h4>{tc.noFiles}.</h4>
                                <p>{tc.filesHowTo}</p>
                            </InfoBox>
                        }
                    </div>
                    }
                    <div className='hidden'>
                        <ReactS3Uploader
                            id='s3Uploader'
                            signingUrl='/s3/sign'
                            onFinish={_finishUpload}
                            onError={_uploadError}
                            contentDisposition='auto'
                        />
                    </div>
                </div>
            </div> :
            <Loading/>
    );
};


const MapStateToProps = (state) => {
    return {
        deal: state.deal,
    };
};

export default connect(
    MapStateToProps,
)(DealFiles);
