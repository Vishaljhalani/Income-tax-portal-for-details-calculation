export default function Breadcrumb({ current }) {
  return (
    <div className="breadcrumb-wrap">
      <div className="container">
        <p className="breadcrumb">Home / {current}</p>
      </div>
    </div>
  );
}