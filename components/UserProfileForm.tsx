"use client";
import { useState } from "react";

type ProfileData = {
    _id: string;
    role: "seeker" | "provider";
    name: string;
    surname: string;
    phoneNumber?: string;
    nationality?: string;
    gender?: string;
    profession?: string;
    certificates?: string[];
    yearsOfExperience?: number;
    bio?: string;
    image?: string;

};

export default function UserProfileForm({initialData}: {initialData: ProfileData}) {
    const [profile, setProfile] = useState(initialData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value } = e.target;
        setProfile((prev) => ({
         ...prev,
         [name]: name === "yearsOfExperience" ? Number(value) : value,
        }));
    };

    const handleSubmit = async () => {

        const res = await fetch("/api/profile",{
            method: "POST",
            body: JSON.stringify(profile),
        });

        if (res.ok){
            alert("Profile updated!");
        }
    };

    return (
        <form onSubmit={(e) => {e.preventDefault(); handleSubmit();}} className="space-y-4">
            <input name="name" value={profile.name} onChange={handleChange} placeholder="Name" />
            <input name="surname" value={profile.surname} onChange={handleChange} placeholder="Surname" />

            {profile.role === "seeker" && (
            <>
            <input name="phoneNumber" value={profile.phoneNumber || ""} onChange={handleChange} placeholder="Phone Number" />
            <input name="nationality" value={profile.nationality || ""} onChange={handleChange} placeholder="Nationality"/>
            <input name="gender" value={profile.gender || ""} onChange={handleChange} placeholder="Gender"/>
            <textarea name="bio" value={profile.bio || ""} onChange={handleChange} placeholder="Short Bio"/>
            </>
            )}

            {profile.role === "provider" && (
                <>

            <input name="phoneNumber" value={profile.phoneNumber || ""} onChange={handleChange} placeholder="Phone Number" />
            <input name="nationality" value={profile.nationality || ""} onChange={handleChange} placeholder="Nationality"/>
            <input name="gender" value={profile.gender || ""} onChange={handleChange} placeholder="Gender"/>
            <input name="profession" value={profile.profession || ""} onChange={handleChange} placeholder="Profession"/>
            <input name="certificates" value={profile.certificates?.join(",") || ""} onChange={(e) =>
            setProfile({...profile, certificates: e.target.value.split(",").map((c) => c.trim()) })
            } placeholder="Certificates (comma seperated)"/>

            <input
            type="number"
            name="yearsOfExperience"
            value={profile.yearsOfExperience || 0}
            onChange={handleChange}
            placeholder="Years of Experience"
            />
            <textarea name="bio" value={profile.bio || ""} onChange={handleChange} placeholder="Short Bio"/>
            </>
            )}

            <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded"> Save </button>
            </form>
    );
}