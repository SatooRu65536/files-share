// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
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

import { BucketsIcon, MenuItem } from 'mds';
import { useNavigate } from 'react-router';

import { Bucket } from '../../../../api/consoleApi';

interface IBucketListItem {
  bucket: Bucket;
}

const BucketListItem = ({ bucket }: IBucketListItem) => {
  const navigate = useNavigate();

  return (
    <MenuItem
      name={bucket.name}
      icon={<BucketsIcon />}
      onClick={() => void navigate(`/browser/${bucket.name}`)}
      id={`manageBucket-${bucket.name}`}
    />
  );
};

export default BucketListItem;
