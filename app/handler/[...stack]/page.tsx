import {StackHandler} from "@stackframe/stack";
import {stackServerApp} from "@/stack";

export default function Handler(props: unknown) {
    return (
        <StackHandler
            fullPage
            app={stackServerApp}
            routeProps={props}
            componentProps={{
                SignIn: {
                    extraInfo: <p>For internal use only.</p>,
                    mockProject: {
                        config: {
                            signUpEnabled: false,
                            credentialEnabled: true,
                            passkeyEnabled: false,
                            magicLinkEnabled: false,
                            oauthProviders: [],
                        },
                    },
                }
            }}
        />
    );
}
