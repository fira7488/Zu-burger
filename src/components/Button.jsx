import { Link } from "react-router-dom";

const styles = {
  primary:
    "bg-zinc-950 text-white shadow-xl shadow-zinc-950/20 hover:bg-yellow-400 hover:text-zinc-950",
  secondary:
    "bg-yellow-400 text-zinc-950 shadow-xl shadow-yellow-900/20 hover:bg-yellow-300",
  outline:
    "border border-yellow-300 bg-white text-zinc-950 hover:border-zinc-950 hover:bg-yellow-50",
  dark: "bg-charcoal text-white hover:bg-black",
};

export default function Button({
  children,
  to,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
  ...props
}) {
  const classes = `inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition duration-200 focus:outline-none focus:ring-4 focus:ring-yellow-300 disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`;

  if (to && !disabled) {
    return (
      <Link className={classes} to={to} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type={type} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
