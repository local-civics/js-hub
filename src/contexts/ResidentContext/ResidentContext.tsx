import { Auth0ContextInterface, Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { request } from "@local-civics/js-client";
import React from "react";
import { useNavigate } from "react-router-dom";
import { AppError, useErrorContext } from "../ErrorContext/ErrorContext";
import * as Sentry from "@sentry/react";
import { ErrorContextProvider } from "../ErrorContext/ErrorContext";

const AuthDomain = "auth.localcivics.io";
const ClientId = "1Epch6YO3dcGBApKkSFCl6dz5aADfU7x";
const ResidentContext = React.createContext(null as ResidentContextState | null);

/**
 * A hook for subscribing to and modifying resident context
 */
export const useResidentContext = () => React.useContext(ResidentContext);

/**
 * The state of the resident context.
 */
export type ResidentContextState = {
  resolving?: boolean;
  saving?: boolean;
  resident?: ResidentState | null;
  accessToken: string | null;
  login?: () => void;
  logout?: () => void;
  save?: (resident: ResidentState) => Promise<void>;
};

/**
 * The state of the resident.
 */
export type ResidentState = {
  [key: string]: number | string | boolean | undefined | string[] | null;
  residentId?: string;
  residentName?: string;
  email?: string;
  givenName?: string;
  familyName?: string;
  communityName?: string;
  communityTrueName?: string;
  communityPlaceName?: string;
  role?: "educator" | "student";
  subject?:
    | "social studies"
    | "english"
    | "math"
    | "science"
    | "special education"
    | "counseling | college & career readiness"
    | "non-instructional staff"
    | "school leadership";
  grade?: "k-5th" | "6th" | "7th" | "8th" | "9th" | "10th" | "11th" | "12th";
  tags?: string[];
  impactStatement?: string;
  avatarURL?: string;
  permissions?: string[];
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
  lastLogoutAt?: string;
  online?: boolean;
};

/**
 * The properties for the resident provider.
 */
export type ResidentContextProviderProps = {
  value?: ResidentContextState;
  children: React.ReactNode;
};

/**
 * A provider for providing resident context.
 *
 * @link https://auth0.com/docs/quickstart/spa/react/01-login#show-user-profile-information
 * @link https://auth0.com/docs/quickstart/spa/react/02-calling-an-api
 * @param props
 * @constructor
 */
export const ResidentContextProvider = (props: ResidentContextProviderProps) => {
  const ResidentComponent = () => {
    const [value, setValue] = React.useState(props.value || null);
    const resident = useResident(value?.accessToken);

    React.useEffect(() => {
      setValue({ ...(props.value || {}), ...resident });
    }, [props.value?.accessToken, props.value?.resolving, resident.saving, resident.accessToken, resident.resolving]);

    return <ResidentContext.Provider value={value}>{props.children}</ResidentContext.Provider>;
  };

  return (
    <ErrorContextProvider>
      <Auth0Provider domain={AuthDomain} clientId={ClientId} redirectUri={window.location.origin}>
        <ResidentComponent />
      </Auth0Provider>
    </ErrorContextProvider>
  );
};

/**
 * A hook for subscribing to resident context updates
 */
const useResident = (token?: string | null) => {
  const auth0 = useAuth0();
  const accessToken = useAccessToken(auth0, token);
  const navigate = useNavigate();
  const errors = useErrorContext();
  const defaultState: ResidentContextState = {
    accessToken: token || null,
    resolving: true,
    saving: false,
    logout: () => !token && auth0.logout({ returnTo: window.location.origin }),
  };
  const [state, setState] = React.useState(defaultState);

  React.useEffect(() => {
    if (!accessToken) {
      Sentry.configureScope((scope) => scope.setUser(null));
      setState(defaultState);
      return;
    }

    setState({ ...state, resolving: true });

    (async () => {
      try {
        const resident = await request(accessToken, "GET", "/identity/v0/resolve");
        setState({ ...state, resident: resident, accessToken: accessToken, resolving: false });
        Sentry.setUser({ id: resident.residentId });
      } catch (e) {
        errors.emit(e);
        // todo: notify user?
      }
    })();

    return () => setState(defaultState);
  }, [accessToken, token]);

  const login = () => (token ? navigate(`/residents/${state.resident?.residentName}`) : auth0.loginWithRedirect());
  const save = async (resident: ResidentState) => {
    if (state.saving) {
      return;
    }

    if (!accessToken) {
      throw new AppError("bad request", "not logged in");
    }

    setState({ ...state, saving: true });
    try {
      Object.keys(resident).forEach((key) => {
        if (resident[key] === undefined) {
          delete resident[key];
        }
      });

      await saveResident(accessToken, resident);
      setState({ ...state, resident: { ...state.resident, ...resident }, saving: false });
    } catch (e) {
      errors.emit(e);
    }
  };

  return { ...state, login: login, save: save };
};

/**
 * A custom hook to obtain an access token.
 * @link https://auth0.com/docs/get-started/apis/scopes/openid-connect-scopes
 */
const useAccessToken = (auth0: Auth0ContextInterface, token?: string | null) => {
  const errors = useErrorContext();
  const [accessToken, setAccessToken] = React.useState(token);
  React.useEffect(() => {
    (async () => {
      if (token) {
        setAccessToken(token);
        return;
      }

      try {
        const accessToken = await auth0.getAccessTokenSilently({
          audience: `https://${AuthDomain}/api/v2/`,
          scope: "read:current_user openid email",
        });
        setAccessToken(accessToken);
      } catch (e) {
        errors.emit(e);
        // todo: notify user?
      }
    })();

    return () => setAccessToken(token);
  }, [auth0.getAccessTokenSilently, auth0.user?.sub, token]);
  return accessToken;
};

const saveResident = async (accessToken: string, resident: ResidentState) => {
  return request(accessToken, "PATCH", "/identity/v0/my/profile", { data: resident });
};