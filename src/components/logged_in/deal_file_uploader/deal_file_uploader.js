import React from 'react';
import ReactS3Uploader from 'react-s3-uploader';
import {updateDeal} from 'store/deal/tasks';
import {connect} from 'react-redux';
import {tc} from 'helpers';

/**s
 * Upload files to deal that are currently set in store state.deal.deal.
 */
const S3DealFileUploader = () => {
    const _finishUpload = async (e, f) => {
        const files = [{
            s3_filename: e.filename,
            original_name: f.name,
        }];

        return await updateDeal({filesToAdd: files});
    };

    const _startUpload = () => {
        document.querySelector('#s3Uploader').click();
    };

    const _uploadError = (message) => {
        console.error('S3 file upload error:', message);
    };

    return(
        <div className='s3UploaderWrapper'>
            <div className='s3UploaderWrapper__s3Uploader'>
                <button onClick={_startUpload}>{tc.addFile}</button>
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
        </div>
    );
};


const MapStateToProps = (state) => {
    return {
        deal: state.deal,
    };
};

export default connect(
    MapStateToProps,
)(S3DealFileUploader);
