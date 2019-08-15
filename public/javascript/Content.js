export const locations = {
  church: {
    title: 'NGK Doorn',
    image: 'flower4',
    navigation: 'https://www.google.com/maps/dir/?api=1&destination=NGK Doorn',
    address: 'Kerkplein 1, 3941 HV Doorn',
  },
  garden: {
    title: 'Moestuin Bartimeus Doorn',
    image: 'flower5',
    address: 'Driebergsestraatweg 44, 3941 ZN Doorn',
    navigation: 'https://www.google.com/maps/dir/?api=1&destination=Moestuin Bartimeus Doorn',
  }
};

let enhanceProgram = (program) => {
  program.forEach((item, index) => {
    let now = moment();

    let startTime = moment();
    let startTimeSplit = item.time.split(':');
    startTime.hour(parseInt(startTimeSplit[0]));
    startTime.minutes(parseInt(startTimeSplit[1]));

    let endTime = moment();
    let endTimeSplit = (program[index + 1] ? program[index + 1].time : '23:59').split(':');
    endTime.hour(parseInt(endTimeSplit[0]));
    endTime.minutes(parseInt(endTimeSplit[1]));

    item.isActive = now.isAfter(startTime) && now.isBefore(endTime);
    item.location = locations[item.location];
  });

  return program;
};

export const program = enhanceProgram([
  {
    title: 'Kerkdienst',
    time: '14:00',
    location: 'church',
    types: ['daggast', 'middaggast', 'anon'],
    description: `We willen graag God's zegen vragen over ons huwelijk, samen met jou, onze ouders, families en vrienden. We willen je vragen om <strong>geen foto's of video's</strong> te maken tijdens de dienst. Graag willen we er een mooie en toegewijde ceremonie van maken. Vergeet de pepermuntrol niet!`
  },
  {
    title: 'Receptie',
    time: '15:20',
    location: 'garden',
    types: ['daggast', 'middaggast', 'anon'],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis elementum nibh tincidunt est accumsan, non ultrices orci sagittis. Pellentesque eros arcu, cursus id odio vitae, fermentum vulputate dolor. Nam bibendum rhoncus metus, quis rutrum justo dignissim at. Pellentesque maximus justo mauris.'
  },
  {
    title: 'Diner',
    time: '17:20',
    location: 'garden',
    types: ['daggast'],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis elementum nibh tincidunt est accumsan, non ultrices orci sagittis. Pellentesque eros arcu, cursus id odio vitae, fermentum vulputate dolor. Nam bibendum rhoncus metus, quis rutrum justo dignissim at. Pellentesque maximus justo mauris.'
  }
]);
