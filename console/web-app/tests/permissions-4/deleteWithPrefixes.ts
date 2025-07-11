// This file is part of MinIO Console Server
// Copyright (c) 2023 MinIO, Inc.
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

import { Selector } from 'testcafe';

import * as elements from '../utils/elements';
import { acknowledgeButton } from '../utils/elements';
import * as functions from '../utils/functions';
import { namedTestBucketBrowseButtonFor } from '../utils/functions';
import * as roles from '../utils/roles';

fixture('Test resources policy').page('http://localhost:9090/');

const bucket1 = 'abucket3';
const test1BucketBrowseButton = namedTestBucketBrowseButtonFor(bucket1);
export const remainingFile = Selector('.ReactVirtualized__Table__rowColumn').withText('abcd');

test
  .before(async (t) => {
    await functions.setUpNamedBucket(t, bucket1);
    await functions.setVersionedBucket(t, bucket1);
    await functions.uploadNamedObjectToBucket(t, bucket1, 'abc', 'web-app/tests/uploads/noextension');
    await functions.uploadNamedObjectToBucket(t, bucket1, 'abcd', 'web-app/tests/uploads/noextension');
  })("Files with similar prefixes don't get deleted with all versions", async (t) => {
    await t
      .useRole(roles.admin)
      .click(acknowledgeButton)
      .typeText(elements.filterBuckets, bucket1)
      .click(test1BucketBrowseButton)
      .click(Selector('.ReactVirtualized__Table__rowColumn').withText('abc'))
      .click(Selector('#delete-element-click'))
      .click(Selector('#delete-versions-switch'))
      .click(Selector('#confirm-ok'))
      .expect(remainingFile.exists)
      .ok();
  })
  .after(async (t) => {
    await functions.cleanUpNamedBucketAndUploads(t, bucket1);
  });
