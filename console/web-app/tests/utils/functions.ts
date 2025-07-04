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

import * as Minio from 'minio';
import { Selector } from 'testcafe';

import * as constants from './constants';
import * as elements from './elements';
import * as roles from './roles';

export const setUpBucket = (t, modifier) => {
  return setUpNamedBucket(t, `${constants.TEST_BUCKET_NAME}-${modifier}`);
};

export const setUpNamedBucket = (t, name: string) => {
  const minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin',
  });
  return minioClient.makeBucket(name, 'us-east-1').catch((err) => {
    console.log(err);
  });
};

export const uploadObjectToBucket = (t, modifier: string, objectName: string, objectPath: string) => {
  const bucketName = `${constants.TEST_BUCKET_NAME}-${modifier}`;
  return uploadNamedObjectToBucket(t, bucketName, objectName, objectPath);
};

export const uploadNamedObjectToBucket = async (t, modifier: string, objectName: string, objectPath: string) => {
  const bucketName = modifier;
  const minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin',
  });
  return minioClient.fPutObject(bucketName, objectName, objectPath, {}).catch((err) => {
    console.log(err);
  });
};

export const setVersioned = (t, modifier) => {
  return setVersionedBucket(t, `${constants.TEST_BUCKET_NAME}-${modifier}`);
};

export const setVersionedBucket = (t, name: string) => {
  const minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin',
  });

  return new Promise((resolve) => {
    minioClient.setBucketVersioning(name, { Status: 'Enabled' }).then(resolve).catch(resolve);
  });
};

export const namedManageButtonFor = (name) => {
  return Selector('div').withAttribute('id', `manageBucket-${name}`);
};

export const manageButtonFor = (modifier) => {
  return namedManageButtonFor(`${constants.TEST_BUCKET_NAME}-${modifier}`);
};

export const cleanUpNamedBucket = (t, name: string) => {
  const minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin',
  });

  return minioClient.removeBucket(name);
};

export const cleanUpBucket = (t, modifier) => {
  return cleanUpNamedBucket(t, `${constants.TEST_BUCKET_NAME}-${modifier}`);
};

export const namedTestBucketBrowseButtonFor = (name) => {
  return Selector('button').withAttribute('id', `manageBucket-${name}`);
};

export const testBucketBrowseButtonFor = (modifier) => {
  return namedTestBucketBrowseButtonFor(`${constants.TEST_BUCKET_NAME}-${modifier}`);
};

export const cleanUpNamedBucketAndUploads = (t, bucket: string) => {
  return new Promise((resolve) => {
    const minioClient = new Minio.Client({
      endPoint: 'localhost',
      port: 9000,
      useSSL: false,
      accessKey: 'minioadmin',
      secretKey: 'minioadmin',
    });

    const stream = minioClient.listObjects(bucket, '', true);

    const proms: any[] = [];
    stream.on('data', function (obj) {
      if (obj.name) {
        proms.push(minioClient.removeObject(bucket, obj.name));
      }
    });

    stream.on('end', () => {
      void Promise.all(proms).then(() => {
        minioClient.removeBucket(bucket).then(resolve).catch(resolve);
      });
    });
  });
};

export const cleanUpBucketAndUploads = (t, modifier) => {
  const bucket = `${constants.TEST_BUCKET_NAME}-${modifier}`;
  return cleanUpNamedBucketAndUploads(t, bucket);
};

export const createUser = (t) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return t
    .useRole(roles.admin)
    .navigateTo(`http://localhost:9090/identity/users/add-user`)
    .typeText(elements.usersAccessKeyInput, constants.TEST_USER_NAME)
    .typeText(elements.usersSecretKeyInput, constants.TEST_PASSWORD)
    .click(elements.saveButton);
};

export const cleanUpUser = (t) => {
  const userListItem = Selector('.ReactVirtualized__Table__rowColumn').withText(constants.TEST_USER_NAME);

  const userDeleteIconButton = userListItem.nextSibling().child('button').withAttribute('aria-label', 'delete');

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return t
    .useRole(roles.admin)
    .navigateTo('http://localhost:9090/identity/users')
    .click(userDeleteIconButton)
    .click(elements.deleteButton);
};
