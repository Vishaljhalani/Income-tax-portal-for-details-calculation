export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h3>Income Tax Portal</h3>
          <p>
            A professional React.js multi-page website concept created for tax information,
            law navigation, forms, help and learning resources.
          </p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <ul>
            <li>Home</li>
            <li>About Us</li>
            <li>Acts & Laws</li>
            <li>Tax Calculator</li>
          </ul>
        </div>

        <div>
          <h4>Support</h4>
          <ul>
            <li>Contact Us</li>
            <li>Grievance</li>
            <li>Forms</li>
            <li>Tutorials</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        © 2026 Income Tax Portal. All rights reserved.
      </div>
    </footer>
  );
}