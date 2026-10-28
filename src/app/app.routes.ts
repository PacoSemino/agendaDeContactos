import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { Agenda } from './pages/agenda/agenda';
import { AgendaDetails } from './pages/agendaDetails/agendaDetails';
import { CreateEditContact } from './pages/createEditContact/createEditContact';
import { authGuardsGuard } from './guards/auth-guards-guard';
import { loginGuardGuard } from './guards/login-guard-guard';

export const routes: Routes = [
    {
        path: "login",
        component: LoginComponent,
        canActivate: [loginGuardGuard]
    },
    {
        path: "register",
        component: RegisterComponent,
        canActivate: [loginGuardGuard]
    },
    {
        path: "",
        component: Agenda,
        canActivate: [authGuardsGuard]
    },
    {
        path: "agenda/create",
        component: CreateEditContact,
        canActivate: [authGuardsGuard]
    },
    {
        path: "agenda/:id/edit",
        component: CreateEditContact,
        canActivate: [authGuardsGuard]
    },
    {
        path: "agenda/:id",
        component: AgendaDetails,
        canActivate: [authGuardsGuard]
    }
];
