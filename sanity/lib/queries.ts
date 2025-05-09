import { defineQuery } from "next-sanity";

export const STARTUPS_QUERY = defineQuery(`*[
  _type == "startup" && defined(slug.current) && 
  (!defined($search) || title match $search || category match $search || author->name match $search)
] | order(_createdAt desc) {
  _id, 
  title, 
  slug,
  _createdAt,
  author -> {
    _id, name, image, bio
  }, 
  views,
  description,
  category,
  image,
}`);

export const STARTUP_BY_ID_QUERY = defineQuery(`*[
  _type == "startup" && _id == $id
][0]{
  _id, 
  title, 
  slug,
  _createdAt,
  author -> {
    _id, name, username, image, bio
  }, 
  views,
  description,
  category,
  image,
  pitch,
}`);

export const STARTUP_VIEWS_QUERY = defineQuery(`*[
  _type == "startup" && _id == $id
][0]{
  _id, views
}`);

export const AUTHOR_BY_ID_QUERY = defineQuery(`*[
  _type == "author" && _id == $id
][0]{
  _id,
  id,
  name,
  username,
  email,
  image,
  bio
}`);

export const STARTUPS_BY_AUTHOR_QUERY = defineQuery(`*[
  _type == "startup" && author._ref == $id
] | order(_createdAt desc) {
  _id, 
  title, 
  slug,
  _createdAt,
  author -> {
    _id, name, image, bio
  }, 
  views,
  description,
  category,
  image,
}`);

export const PLAYLIST_BY_SLUG_QUERY = defineQuery(`*[
  _type == "playlist" && slug.current == $slug
][0]{
  _id,
  title,
  slug,
  select[]->{
    _id,
    _createdAt,
    title,
    slug,
    author->{
      _id,
      name,
      slug,
      image,
      bio
    },
    views,
    description,
    category,
    image,
    pitch
  }
}`);

export const SERVICES_QUERY = defineQuery(`*[
  _type == "service" && defined(slug.current) && 
  (!defined($search) || title match $search || category match $search || provider->name match $search)
] | order(_createdAt desc) {
  _id, 
  title, 
  slug,
  _createdAt,
  provider -> {
    _id, name, image, bio
  }, 
  views,
  description,
  category,
  image,
  priceRange,  // Added price range for services
}`);

export const SERVICE_BY_ID_QUERY = defineQuery(`*[
  _type == "service" && _id == $id
][0]{
  _id, 
  title, 
  slug,
  _createdAt,
  provider -> {
    _id, name, username, image, bio
  }, 
  views,
  description,
  category,
  image,
  priceRange,  // Added price range for service
  details,     // Replaced 'pitch' with 'details' for more service-oriented description
}`);

export const SERVICE_VIEWS_QUERY = defineQuery(`*[
  _type == "service" && _id == $id
][0]{
  _id, views
}`);

export const PROVIDER_BY_ID_QUERY = defineQuery(`*[
  _type == "provider" && _id == $id  // Adjusted _type to "provider" for service providers
][0]{
  _id,
  name,
  username,
  email,
  image,
  bio
}`);

export const SERVICES_BY_PROVIDER_QUERY = defineQuery(`*[
  _type == "service" && provider._ref == $id  // Adjusted to reference provider for services
] | order(_createdAt desc) {
  _id, 
  title, 
  slug,
  _createdAt,
  provider -> {
    _id, name, image, bio
  }, 
  views,
  description,
  category,
  image,
  priceRange,
}`);

export const FEATURED_SERVICES_QUERY = defineQuery(`*[
  _type == "playlist" && slug.current == $slug
][0]{
  _id,
  title,
  slug,
  select[]->{
    _id,
    _createdAt,
    title,
    slug,
    provider->{
      _id,
      name,
      slug,
      image,
      bio
    },
    views,
    description,
    category,
    image,
    details  // Replaced 'pitch' with 'details'
  }
}`);
