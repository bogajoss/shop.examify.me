import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/data/mockData';
import CourseDetailsClient from './CourseDetailsClient';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const course = db.courses.find(c => c.id === id);

  if (!course) {
    return {
      title: 'Course Not Found | Examify',
    };
  }

  return {
    title: `${course.title} | Examify`,
    description: course.description,
    openGraph: {
      title: course.title,
      description: course.description,
      images: [`https://placehold.co/1200x630?text=${encodeURIComponent(course.title)}`],
    },
  };
}

export default async function CoursePage({ params }: Props) {
  const { id } = await params;
  const course = db.courses.find(c => c.id === id);

  if (!course) {
    notFound();
  }

  return <CourseDetailsClient course={course} />;
}