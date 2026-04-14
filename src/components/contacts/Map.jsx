export default function Map() {
  return (
    <div className="w-full h-[500px] bg-gray-200">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24404.314081623525!2d65.34195301610895!3d40.13027015457925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f51c77d1d188427%3A0x5a05413aaed3449e!2z0JjRgdC70L7QvCDQmtCw0YDQuNC80L7QsiA5OQ!5e0!3m2!1sru!2s!4v1775371846410!5m2!1sru!2s"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}
