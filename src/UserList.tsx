import React, {
  Suspense,
  SuspenseListProps,
  unstable_useMutableSource,
  unstable_createMutableSource,
} from "react";

// ==============================================
// randomuser.me types
// ==============================================
interface UserData {
  gender: string;
  name: {
    first: string;
    last: string;
    title: string;
  };
  location: {
    street: string;
    city: string;
    state: string;
    postcode: string;
    coordinates: {
      latitude: string;
      longitude: string;
    };
    timezone: {
      offset: string;
      description: string;
    };
  };
  email: string;
}

interface APIResult {
  results: Array<UserData>;
}

const getUserProfile = async (): Promise<UserData> => {
  const response = await fetch("https://randomuser.me/api/", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data: APIResult = await response.json();
  return data.results[0];
};

interface UserState {
  data: UserData | null;
}

// ==============================================
// Legacy Class Component
// ==============================================
export class User extends React.Component<any, UserState> {
  state = {
    data: null,
  };

  async componentDidMount() {
    const user = await getUserProfile();
    this.setState({ data: user });
  }

  render() {
    const { data } = this.state;

    if (!data) {
      return <p>Loading...</p>;
    } else {
      const user = (data as unknown) as UserData; // don't know why the compiler requires I do this first
      return (
        <div style={{ outline: "1px solid black" }}>
          <p>
            {" "}
            <b>Name:</b>
            {user.name.first}{" "}
          </p>
        </div>
      );
    }
  }
}

// ==============================================
// Resource Method
// ==============================================

const UserResource = () => {
  const _promiseCache: { [key: string]: { read: () => any } } = {};

  // Suspense integrations like Relay implement
  // a contract like this to integrate with React.
  // Real implementations can be significantly more complex.
  // Don't copy-paste this into your project!
  function wrapPromise() {
    const promise = getUserProfile();

    let status = "pending";
    let result: any;
    let suspender = promise.then(
      (r) => {
        status = "success";
        result = r;
      },
      (e) => {
        status = "error";
        result = e;
      }
    );
    return {
      read() {
        if (status === "pending") {
          throw suspender;
        } else if (status === "error") {
          throw result;
        } else if (status === "success") {
          return result;
        }
      },
    };
  }

  return {
    user: (id: string) => {
      if (!_promiseCache[id]) {
        _promiseCache[id] = wrapPromise();
      }
      return _promiseCache[id];
    },
  };
};

const resource = UserResource();

export const UserScheduled = (props: { id: string }) => {
  const data = resource.user(props.id).read();

  const user = (data as unknown) as UserData; // don't know why the compiler requires I do this first
  return (
    <div style={{ outline: "1px solid black" }}>
      <p>
        {" "}
        <b>Name:</b>
        {user.name.first}{" "}
      </p>
    </div>
  );
};
