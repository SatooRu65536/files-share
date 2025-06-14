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

const objectCalls: { [key: string]: XMLHttpRequest } = {};
const formDataElements: { [key: string]: FormData } = {};

export const storeCallForObjectWithID = (id: string, call: any) => {
  objectCalls[id] = call;
};

export const callForObjectID = (id: string): any => {
  return objectCalls[id];
};

export const storeFormDataWithID = (id: string, formData: FormData) => {
  formDataElements[id] = formData;
};

export const formDataFromID = (id: string): FormData => {
  return formDataElements[id];
};

export const removeTrace = (id: string) => {
  delete objectCalls[id];
  delete formDataElements[id];
};

export const makeid = (length: number) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
