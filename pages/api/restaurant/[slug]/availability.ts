import { NextApiRequest, NextApiResponse } from 'next';
import { times } from '../../../../data';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Response {
  returnCode: number;
  message: any[];
  errorMessage: string[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug, day, time, partySize } = req.query as {
    slug: string;
    day: string;
    time: string;
    partySize: string;
  };

  const response: Response = { returnCode: 0, message: [], errorMessage: [] };

  if (!slug || !day || !time || !partySize) {
    response.returnCode = 400;
    response.errorMessage.push('Invalid data provided');
  } else {
    // Check if the restaurant is open
    // http://localhost:3000/api/restaurant/vivaan-fine-indian-cuisine-ottawa/availability?day=2024-04-01&time=14:30:00.000Z&partySize=4

    const searchTimes = times.find((t) => t.time === time)?.searchTimes;

    if (!searchTimes) {
      response.returnCode = 400;
      response.errorMessage.push('Invalid data provided');
    } else {
      const bookings: any = await prisma.n13_Booking.findMany({
        where: {
          booking_time: {
            gte: new Date(`${day}T${searchTimes[0]}`),
            lte: new Date(`${day}T${searchTimes[searchTimes.length - 1]}`),
          },
        },
        select: {
          number_of_people: true,
          booking_time: true,
          tables: true,
        },
      });

      // sample_bookings: [
      //   {
      //     number_of_people: 4;
      //     booking_time: '2024-04-01T14:00:00.000Z';
      //     tables: [
      //       {
      //         booking_id: 1;
      //         table_id: 1;
      //         created_at: '2024-03-04T23:45:29.280Z';
      //         updated_at: '2024-03-04T23:45:02.376Z';
      //       }
      //     ];
      //   },
      //   {
      //     number_of_people: 6;
      //     booking_time: '2024-04-01T14:30:00.000Z';
      //     tables: [
      //       {
      //         booking_id: 2;
      //         table_id: 1;
      //         created_at: '2024-03-04T23:50:37.179Z';
      //         updated_at: '2024-03-04T23:49:48.804Z';
      //       },
      //       {
      //         booking_id: 2;
      //         table_id: 2;
      //         created_at: '2024-03-04T23:50:37.179Z';
      //         updated_at: '2024-03-04T23:50:21.955Z';
      //       }
      //     ];
      //   }
      // ];

      // The above sample needs to be "reduced" to the following:
      // bookingTablesObj: {
      //   '2024-04-01T14:00:00.000Z': {
      //     '1': true;
      //   };
      //   '2024-04-01T14:30:00.000Z': {
      //     '1': true;
      //     '2': true;
      //   };
      // };

      const bookingTablesObj: { [key: string]: { [key: number]: true } } = {};

      // CoPilot explanation of the following code:
      // The forEach loop iterates over each booking in the bookings array.
      // For each booking, it does the following:
      // It converts the booking_time to an ISO string format using the
      //   toISOString() method. This is a standard string format for dates and
      //   times, which makes it easier to compare and sort dates.
      // It uses this ISO string as a key in the bookingTablesObj object. The
      //   value for this key is determined by the reduce function.
      bookings.forEach((booking: any) => {
        // The reduce function is used to transform the tables array into an object.
        // The reduce function takes two arguments: a callback function and an initial
        //   value for the accumulator (in this case, an empty object {}).
        // The callback function is called for each table in the tables array. It
        //   takes two arguments: the accumulator obj (which is the object being built
        //   up over the course of the reduction), and the current table.
        // For each table, the callback function does the following:
        // It returns a new object that combines the properties of the current
        //   obj and a new property. The new property's key is the table_id of the
        //   current table, and its value is true.
        bookingTablesObj[booking.booking_time.toISOString()] = booking.tables.reduce(
          (obj: any, table: any) => {
            return {
              ...obj,
              [table.table_id]: true,
            };
          },
          {}
        );
        // The end result of this reduce function is an object where each key
        //   is a table_id and each value is true. This object represents all the
        //   tables that are associated with the current booking.
        // In summary, this code transforms an array of bookings into an
        //   object where each key is a booking time (in ISO string format) and each
        //   value is an object representing the tables associated with that booking.
      });

      const restaurant = await prisma.n13_Restaurant.findUnique({
        where: {
          slug,
        },
        select: {
          tables: true,
          open_time: true,
          close_time: true,
        },
      });

      if (!restaurant) {
        response.returnCode = 400;
        response.errorMessage.push('Invalid data provided');
      } else {
        const tables = restaurant.tables;

        // For all of the searched times, we get the table selection
        const searchTimesWithTables = searchTimes.map((searchTime) => {
          return {
            date: new Date(`${day}T${searchTime}`),
            time: searchTime,
            // tables,
            // CoPilot suggestion:
            tables: tables.filter((table) => {
              const isTableAvailable =
                !bookingTablesObj[new Date(`${day}T${searchTime}`).toISOString()]?.[table.id];
              return isTableAvailable;
            }),

            // Now, we remove the tables that are already booked
            // tables: tables.filter((table) => {
            //   if (bookingTablesObj[new Date(`${day}T${searchTime}`).toISOString()]) {
            //     if (bookingTablesObj[new Date(`${day}T${searchTime}`).toISOString()][table.id])
            //       return false;
            //   }
            //   return true;
            // }),
          };
        });

        // Now, we remove the tables that are already booked
        // searchTimesWithTables.forEach((t) => {
        //   t.tables = t.tables.filter((table) => {
        //     if (bookingTablesObj[t.date.toISOString()]) {
        //       if (bookingTablesObj[t.date.toISOString()][table.id]) return false;
        //     }
        //     return true;
        //   });
        // });

        const availabilities = searchTimesWithTables
          .map((t) => {
            const sumSeats = t.tables.reduce((sum, table) => sum + table.seats, 0);
            return {
              time: t.time,
              available: sumSeats >= parseInt(partySize),
            };
          })
          .filter((availability) => {
            const timeisAfterOpenningHour =
              new Date(`${day}T${availability.time}`) >=
              new Date(`${day}T${restaurant.open_time}`);
            const timeisBeforeClosingHour =
              new Date(`${day}T${availability.time}`) <=
              new Date(`${day}T${restaurant.close_time}`);
            return timeisAfterOpenningHour && timeisBeforeClosingHour;
          });

        response.returnCode = 200;
        response.message.push({ availabilities });
      }
    }
  }

  return res.status(response.returnCode).json(response);
}
