// Used for navigation history, to be shown in breadcrumbs.
import {createBrowserHistory} from 'history';
export const history = createBrowserHistory();

export const addRouteToHistory = (value) => {
    history.push(value);
};

// Used for breadcrumbs.
export const routes = {
    aktivitet: 'Aktivitet',
    bearbeta: 'Bearbeta',
    hem: 'Vår tjänst',
    inloggning: 'Inloggning',
    listor: 'Listor',
    priser: 'Priser',
    prospektera: 'Prospektera',
    resultat: 'Resultat',
    team: 'Team',
};

