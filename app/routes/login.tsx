import { Form, useActionData } from "@remix-run/react";
import { redirect, type ActionFunctionArgs } from "@remix-run/cloudflare";

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const enteredCode = formData.get("inviteCode") as string;
  const env = (context.cloudflare as any).env;

  const allCodes = Object.keys(env)
    .filter((key) => key.startsWith("CODE_") || key === "VITE_INVITE_CODE")
    .map((key) => env[key]);

  if (allCodes.includes(enteredCode)) {
    return redirect("/", {
      headers: {
        "Set-Cookie": "is_allowed=true; Path=/; Max-Age=86400; HttpOnly; SameSite=Lax",
      },
    });
  }

  return { error: "Invalid code!" };
};

export default function Login() {
  const actionData = useActionData<typeof action>();
  return (
    <div style={{ backgroundColor: '#000', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <h1>Enter Invite Code</h1>
      <Form method="post" style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '280px' }}>
        <input name="inviteCode" type="password" placeholder="Enter Code" style={{ padding: '12px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#111', color: 'white' }} />
        {actionData?.error && <p style={{ color: '#ff4d4d' }}>{actionData.error}</p>}
        <button type="submit" style={{ padding: '12px', backgroundColor: '#8B5CF6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>Verify</button>
      </Form>
    </div>
  );
}
