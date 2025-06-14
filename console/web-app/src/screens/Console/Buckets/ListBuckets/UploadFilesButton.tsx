// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import { Button, DropdownSelector, UploadFolderIcon, UploadIcon } from 'mds';
import React, { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import { CSSObject } from 'styled-components';

import { hasPermission } from '../../../../common/SecureComponent';
import { IAM_SCOPES, permissionTooltipHelper } from '../../../../common/SecureComponent/permissions';
import { AppState } from '../../../../store';
import TooltipWrapper from '../../Common/TooltipWrapper/TooltipWrapper';
import { getSessionGrantsWildCard } from './UploadPermissionUtils';

interface IUploadFilesButton {
  uploadPath: string;
  bucketName: string;
  forceDisable?: boolean;
  uploadFileFunction: (closeFunction: () => void) => void;
  uploadFolderFunction: (closeFunction: () => void) => void;
  overrideStyles?: CSSObject;
}

const UploadFilesButton = ({
  bucketName,
  forceDisable = false,
  overrideStyles = {},
  uploadFileFunction,
  uploadFolderFunction,
  uploadPath,
}: IUploadFilesButton) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [uploadOptionsOpen, uploadOptionsSetOpen] = useState<boolean>(false);

  const anonymousMode = useSelector((state: AppState) => state.system.anonymousMode);

  const sessionGrants = useSelector((state: AppState) =>
    state.console.session ? state.console.session.permissions || {} : {},
  );

  const putObjectPermScopes = [IAM_SCOPES.S3_PUT_OBJECT, IAM_SCOPES.S3_PUT_ACTIONS];

  const sessionGrantWildCards = getSessionGrantsWildCard(sessionGrants, uploadPath, putObjectPermScopes);

  const openUploadMenu = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    uploadOptionsSetOpen(!uploadOptionsOpen);
    setAnchorEl(event.currentTarget);
  };
  const handleCloseUpload = () => {
    setAnchorEl(null);
  };

  const uploadObjectAllowed =
    hasPermission([uploadPath, ...sessionGrantWildCards], putObjectPermScopes) || anonymousMode;

  const uploadFolderAllowed = hasPermission([bucketName, ...sessionGrantWildCards], putObjectPermScopes, false, true);

  const uploadFolderAction = (action: string) => {
    if (action === 'folder') {
      uploadFolderFunction(handleCloseUpload);
      return;
    }

    uploadFileFunction(handleCloseUpload);
  };

  const uploadEnabled: boolean = uploadObjectAllowed || uploadFolderAllowed;

  return (
    <Fragment>
      <TooltipWrapper
        tooltip={
          uploadEnabled
            ? 'Upload Files'
            : permissionTooltipHelper(
                [IAM_SCOPES.S3_PUT_OBJECT, IAM_SCOPES.S3_PUT_ACTIONS],
                'upload files to this bucket',
              )
        }
      >
        <Button
          id={'upload-main'}
          aria-controls={`upload-main-menu`}
          aria-haspopup="true"
          aria-expanded={openUploadMenu ? 'true' : undefined}
          onClick={handleClick}
          label={'Upload'}
          icon={<UploadIcon />}
          variant={'callAction'}
          disabled={forceDisable || !uploadEnabled}
          sx={overrideStyles}
        />
      </TooltipWrapper>
      <DropdownSelector
        id={'upload-main-menu'}
        options={[
          {
            label: 'Upload File',
            icon: <UploadIcon />,
            value: 'file',
            disabled: !uploadObjectAllowed || forceDisable,
          },
          {
            label: 'Upload Folder',
            icon: <UploadFolderIcon />,
            value: 'folder',
            disabled: !uploadFolderAllowed || forceDisable,
          },
        ]}
        selectedOption={''}
        onSelect={(nValue: string) => uploadFolderAction(nValue)}
        hideTriggerAction={() => {
          uploadOptionsSetOpen(false);
        }}
        open={uploadOptionsOpen}
        anchorEl={anchorEl}
        anchorOrigin={'end'}
        useAnchorWidth
      />
    </Fragment>
  );
};

export default UploadFilesButton;
