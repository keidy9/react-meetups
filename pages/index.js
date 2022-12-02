import { Fragment } from "react";
import Head from "next/head";
import { MongoClient } from "mongodb";

import MeetupList from "../components/meetups/MeetupList";

const HomePage = (props) => {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active React meetups!"
        />
      </Head>
      <MeetupList meetups={props.meetups} />;
    </Fragment>
  );
};

// export const getServerSideProps = async (context) => {
//   // getServerSideProps only runs for every request, better for data that changes frequently?
//   const req = context.req;
//   const res = context.res;

//   // Fetch data from an API

//   return {
//     props: {
//       meetips: DUMMY_MEETUPS,
//     },
//   };
// };

export const getStaticProps = async () => {
  // Fetch data from an API
  const client = await MongoClient.connect(
    "mongodb+srv://killer:xHYY56XLLTqQtmso@cluster0.dixuzc3.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.data.title,
        address: meetup.data.address,
        image: meetup.data.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 10, //rerenders the page on the server-side every 10 seconds, to rerender client-side for any changes so client-side page isnt outdated??
  };
};

export default HomePage;
