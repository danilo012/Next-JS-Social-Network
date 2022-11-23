import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import api from "../../lib/axios";

export const getStaticPaths = async () => {
  const fetch = await api.get("/api/users");
  const res = await fetch.data;

  const paths = data.users.map((item: any) => {
    return {
      params: { id: String(item.id) },
    };
  });

  return { paths, fallback: false };
};

export const getStaticProps = async (context: any) => {
  const id = context.params.id;
  const fetch = await api.get("/api/users/" + id);
  const res = await fetch.data;

  return {
    props: {
      user: data,
    },
    revalidate: 10,
  };
};

export default function Details({ user }: any) {
  const { data: session } = useSession({ required: true });

  if (session) {
    return (
      <div>
        <Head>
          <title>{user.user.name} - Next JS Social Network</title>
          <meta
            name="description"
            content="A news website made with The Guardian API, Next JS, and Tailwind CSS based on Globo's G1."
          />
          <link rel="icon" href="/favicon.png" />
        </Head>

        <div className="xl:flex block xl:max-w-7xl xl:mx-auto">
          <div className="xl:pt-36 pt-20 xl:ml-5 xl:flex block">
            <Image
              src={user.user.image}
              width={100}
              height={100}
              alt={user.user.name + "profile picture"}
              className="w-36 xl:mx-0 mx-auto rounded-lg"
            />
            <div>
              <h1 className="xl:ml-10 mt-2 text-center font-medium text-3xl text-gray-600">
                {user.user.name}
              </h1>
              <p className="xl:ml-10 text-center text-gray-400">
                {user.user.email}
              </p>
              <Link href="/">
                <button className="flex mt-2 mx-auto xl:ml-24 text-white bg-blue-700 rounded-md px-5 py-2 hover:bg-blue-800 transition-all ease-in duration-75">
                  Back
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <Head>
          <title>Next JS Social Network</title>
          <meta
            name="description"
            content="A news website made with The Guardian API, Next JS, and Tailwind CSS based on Globo's G1."
          />
          <link rel="icon" href="/favicon.png" />
        </Head>

        <div className="xl:flex block xl:max-w-7xl xl:mx-auto">
          <div className="pt-20 ml-5">
            <p>...</p>
          </div>
        </div>
      </div>
    );
  }
}
