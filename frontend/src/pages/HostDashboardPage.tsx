const HostDashboardPage = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Host Dashboard</h1>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', width: '30%' }}>
          <h2>Upcoming Events</h2>
          <ul>
            <li>Event 1</li>
            <li>Event 2</li>
            <li>Event 3</li>
          </ul>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', width: '30%' }}>
          <h2>Recent Bookings</h2>
          <ul>
            <li>Booking 1</li>
            <li>Booking 2</li>
            <li>Booking 3</li>
          </ul>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', width: '30%' }}>
          <h2>Messages</h2>
          <ul>
            <li>Message 1</li>
            <li>Message 2</li>
            <li>Message 3</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HostDashboardPage;