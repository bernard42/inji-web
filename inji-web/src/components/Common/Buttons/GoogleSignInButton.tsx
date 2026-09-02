import { FcGoogle } from "react-icons/fc";
import {GoogleSolidButtonStyles} from "./GoogleSignInButtonStyles.ts";

export const GoogleSignInButton:React.FC<GoogleSignInButtonProps> = (props) => {
  return (
    <button
      onClick={props.handleGoogleLogin}
      disabled={props.isLoading}
      data-testid="google-login-button"
      className={`${GoogleSolidButtonStyles.baseStyles} ${props.isLoading ? GoogleSolidButtonStyles.disabledClasses : ""}`}
    >
      <FcGoogle size={24} className="flex-shrink-0" />
      {props.isLoading ? props.loadingText : props.text}
    </button>
  );
};

export type GoogleSignInButtonProps = {
    handleGoogleLogin: () => void;
    loadingText: string;
    text: string;
    /**
     * Owned by the parent, because the click may not lead straight to a redirect
     * (e.g. it opens a confirmation modal first) and the button has to un-latch
     * if that modal is dismissed.
     */
    isLoading: boolean;
  };
