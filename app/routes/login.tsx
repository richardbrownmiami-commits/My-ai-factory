import { useState } from 'react';
import { redirect, type ActionFunctionArgs } from '@remix-run/cloudflare';
import { useActionData, Form } from '@remix-run/react';

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const code = formData.get("inviteCode") as string;
  const kv = (context.cloudflare as any).env.INVITE_KV;

  const dataString = await kv.get(code);
  if (!dataString) return { error: "Invalid Code" };

  const data = JSON.parse(dataString);
  const now = Math.floor(Date.now() / 1000);

  if (data.uses < data.limit && (!data.expires || now < data.expires)) {
    // Increase the usage count in the database
    data.uses += 1;
    await kv.put(code, JSON.stringify(data));
    
    return redirect("/", {
      headers: {
        "Set-Cookie": `invite_code=${code}; Path=/; Max-Age=86400; HttpOnly; SameSite=Lax`,
      },
    });
  }

  return { error: "Code expired or limit reached" };
};

export default function Login() {
  const actionData = useActionData<typeof action>();

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Oman's Private AI</h1>
      <p style={{ color: '#888', marginBottom: '20px' }}>Enter your invite code to start.</p>
      
      <Form method="post" style={{ width: '100%', maxWidth: '300px', display: 'flex', flexDirection: 'column' }}>
        <input 
          name="inviteCode"
          type="text" 
          placeholder="Invite Code"
          required
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#111', color: '#fff', marginBottom: '10px', textAlign: 'center' }}
        />
        {actionData?.error && <p style={{ color: '#ff4444', fontSize: '14px', textAlign: 'center', marginBottom: '10px' }}>{actionData.error}</p>}
        <button type="submit" style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#8B5CF6', color: '#fff', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
          Verify Access
        </button>
      </Form>
    </div>
  );
}
