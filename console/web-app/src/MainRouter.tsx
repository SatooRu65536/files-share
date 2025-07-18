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

import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';

import LoadingComponent from './common/LoadingComponent';
import { baseUrl } from './history';
import ProtectedRoute from './ProtectedRoutes';
import AppConsole from './screens/Console/ConsoleKBar';

const Login = React.lazy(() => import('./screens/LoginPage/Login'));
const Logout = React.lazy(() => import('./screens/LogoutPage/LogoutPage'));

const MainRouter = () => {
  return (
    <BrowserRouter basename={baseUrl}>
      <Routes>
        <Route
          path="/logout"
          element={
            <Suspense fallback={<LoadingComponent />}>
              <Logout />
            </Suspense>
          }
        />
        <Route
          path="/login"
          element={
            <Suspense fallback={<LoadingComponent />}>
              <Login />
            </Suspense>
          }
        />
        <Route path={'/*'} element={<ProtectedRoute Component={AppConsole} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default MainRouter;
